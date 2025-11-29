// this file is the main entry point of the React application. It sets up the routing for different pages using react-router-dom.
// imports
import HomePage from "./routes/homePage/homePage";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ListPage from "./routes/listPage/listPage";
import {Layout, RequiredAuth } from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import ProfileUpdatePage from './routes/profileUpdatePage/profileUpdatePage';
import NewPostPage from "./routes/newPostPage/newPostPage";
import EditPostPage from "./routes/editPostPage/editPostPage";
import AboutPage from "./routes/aboutPage/aboutPage";
import ContactPage from "./routes/contactPage/contactPage";
import AgentsPage from "./routes/agentsPage/agentsPage";
import { listPageLoader, singlePageLoader, profilePageLoader, agentsPageLoader } from './lib/loaders';

// App component definition
function App() {
  const router = createBrowserRouter([
    {
      // this path uses the Layout component to wrap public routes
      path: "/",
      element: <Layout />,
      children:[
        {
          // the home page route
          path:"/",
          element:<HomePage/>
        },
        {
          // the list page route with its loader
          path:"/list",
          element:<ListPage/>,
          loader:listPageLoader,
        },
        {
          // the single page route with its loader
          path:"/:id",
          element:<SinglePage/>,
          loader:singlePageLoader,

        },
        {
          // the about page route
          path:"/about",
          element:<AboutPage/>
        },
        {
          // the contact page route
          path:"/contact",
          element:<ContactPage/>
        },
        {
          // the agents page route with its loader
          path:"/agents",
          element:<AgentsPage/>,
          loader:agentsPageLoader,
        },
        {
          // the login page route
          path:"/login",
          element:<Login/>
        },
        {
          // the register page route
          path:"/register",
          element:<Register/>
        }
      ],
      
    },
    {
      // this path uses the RequiredAuth component to wrap protected routes that require authentication
      path: "/",
      element: <RequiredAuth />,
      children:[
        
        {
          // the profile page route with its loader
          path:"/profile",
          element:<ProfilePage/>,
          loader:profilePageLoader,
        },
        {
          // the profile update page route
          path:"/profile/update",
          element:<ProfileUpdatePage/>
        },
        {
          // the new post page route
          path:"/add",
          element:<NewPostPage/>
        },
        {
          // the edit post page route with its loader
          path:"/edit/:id",
          element:<EditPostPage/>,
          loader:singlePageLoader,
        }
      ]
    }
  ]);

  return (

    // RouterProvider to provide the router to the application
    <RouterProvider router={router}/>
  );
}

export default App;
