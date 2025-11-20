import { useEffect, useRef } from 'react';

const uploadWidget = ({ uwConfig, setPublicId, setState }) => {
  const uploadWidgetRef = useRef(null);
  const uploadButtonRef = useRef(null);

  useEffect(() => {
    let unmounted = false;

    const loadScript = () =>
      new Promise((resolve, reject) => {
        if (window.cloudinary) return resolve();
        const s = document.createElement('script');
        s.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
        s.async = true;
        s.onload = () => resolve();
        s.onerror = (e) => reject(e);
        document.head.appendChild(s);
      });

    const initializeUploadWidget = async () => {
      try {
        await loadScript();
      } catch (err) {
        console.error('Failed to load Cloudinary script', err);
        return;
      }

      if (!window.cloudinary) {
        console.error('Cloudinary not available after script load');
        return;
      }

      if (!uploadButtonRef.current) return;

      uploadWidgetRef.current = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
          if (!error && result && result.event === 'success') {
            console.log('Upload successful:', result.info);
            if (!unmounted) {
              
              setState(prev=>[...prev,result.info.secure_url])
              if (setPublicId) setPublicId(result.info.public_id);
            }
          }
        }
      );

      const handleUploadClick = () => {
        if (uploadWidgetRef.current) {
          uploadWidgetRef.current.open();
        }
      };

      const buttonElement = uploadButtonRef.current;
      buttonElement.addEventListener('click', handleUploadClick);

      return () => {
        unmounted = true;
        buttonElement.removeEventListener('click', handleUploadClick);
      };
    };

    const cleanup = initializeUploadWidget();
    return () => {
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then((fn) => fn && fn());
      }
      unmounted = true;
    };
  }, [uwConfig, setPublicId, setState]);

  return (
    <button
      ref={uploadButtonRef}
      id="upload_widget"
      className="cloudinary-button"
    >
      Upload
    </button>
  );
};

export default uploadWidget;
