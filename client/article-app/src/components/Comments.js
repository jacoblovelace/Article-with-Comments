import { useState, useEffect } from 'react';
import axios from 'axios';
import Textarea from 'react-expanding-textarea'
import './Comments.css';

function Comments ({user}) {

  // update refresh key for any functions that modify comment collection in database
  const [refreshKey, setRefreshKey] = useState(1);

  const [commentList, setCommentList] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isEditing, setIsEditing]= useState('');
  const [commentTextEdit, setCommentTextEdit] = useState('');


   /* fetch comments from database on mount AND when refreshKey is updated */
   useEffect(() => {
    const getComments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/comment");
        // update comment list state with fetched data
        setCommentList(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getComments();
  }, [refreshKey]);  

  /* function to add a comment to the database */
  const addComment = async (e) => {
    e.preventDefault();
    try {
      console.log(user.email);
      await axios.post("http://localhost:5000/api/comment", {author: user.name, body: commentText, user: user.email});
      setCommentText('');
      setRefreshKey(refreshKey => refreshKey * -1);
    } catch (error) {
      console.log(error);
    }
  }

  /* function to edit a comment from database */
  const editComment = async (e) => {
    e.preventDefault();
    try {
      // update the body of the comment with the id of isEditing
      await axios.put(`http://localhost:5000/api/comment/${isEditing}`, {body: commentTextEdit});
      setCommentTextEdit('');
      setIsEditing('');
      setRefreshKey(refreshKey => refreshKey * -1);
    } catch (error) {
      console.log(error);
    }
  }

   /* function to delete a comment from database */
   const deleteComment = async (id) => {
    try {
      // remove from database
      await axios.delete(`http://localhost:5000/api/comment/${id}`);
      setRefreshKey(refreshKey => refreshKey * -1);
    } catch (error) {
      console.log(error);
    }
  }
  
  /* what gets rendered when creating a new comment */
  const displayAddCommentForm = () => (
    <form className="comment-input" onSubmit={e => handleAddCommentInput(e)}>
      <Textarea className="comment-text" type="text" required placeholder='Say something...' onChange={e => {setCommentText(e.target.value)}} value={commentText}></Textarea>
      <button className="comment-btn" type="submit">Comment</button>
    </form>
  )

  /* what gets rendered when editing a comment */
  const displayEditForm = (comment) => (
    <form className="comment-input-update" onSubmit={e => handleEditCommentInput(e, true)}>
      <Textarea className="comment-text" type="text" onChange={e => {setCommentTextEdit(e.target.value)}} defaultValue={comment.body}></Textarea>
      <button className="comment-btn" type="submit">Update</button>
    </form>
  )

  /* prevent submission of empty string or whitespace characters to addComment form */
  const handleAddCommentInput = (e) => {
    e.preventDefault();
    if (commentText && commentText.trim()) {
      addComment(e);
    }
  }

  /* prevent submission of empty string or whitespace characters to editComment form */
  const handleEditCommentInput = (e) => {
    e.preventDefault();
    if (commentTextEdit && commentTextEdit.trim()) {
      editComment(e);
    }
  }

  return (
    <div className="comment-container">
      <h3 className="num-comments">Comments &#40;{commentList.length}&#41;</h3>
      <div className="comment-box">
        {
          Object.keys(user).length !== 0 ?
          <>
            <h2>Leave a comment</h2>
            {displayAddCommentForm()}
          </>
          :
          <h2>Sign in to leave a comment</h2>
        }
        {
          commentList.map( (comment, index) => (
            <div className="comment" key={comment._id}>
              <div className="comment-header">
                <div className="comment-info">
                  <h3 className="comment-author">{comment.author}</h3>
                  <span className="comment-date">{comment.date}</span>
                </div>
                <div className="action-btns">
                {
                  comment.user === user.email && 
                  <>
                    <button type="button" onClick={() => {setIsEditing(comment._id)}}>Edit</button>
                    <button type="button" onClick={() => {deleteComment(comment._id)}}>Delete</button>
                  </> 
                }
                </div>
              </div>
              {isEditing === comment._id ? displayEditForm(comment) : <p className="comment-body">{comment.body}</p>}
              {index !== commentList.length-1 && <hr className="comment-sep"/>}
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Comments;
