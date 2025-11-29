// this is the list component that renders a list of cards
// each card represents a post
// imports
import './list.scss'
import Card from"../card/Card"

// List component that takes posts and callback functions for delete and save actions
function List({posts, onDelete, onSave}){
  return (
    //  container for the list of cards
    <div className='list'>
      {/* map of posts, each post is a card item with key post.id */}
      {posts.map(item=>(
        <Card key={item.id} item={item} onDelete={onDelete} onSave={onSave}/>
      ))}
    </div>
  )
}

export default List