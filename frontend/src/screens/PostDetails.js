import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link
import { AiOutlineHeart, AiFillHeart, AiOutlineComment, AiOutlineUser } from 'react-icons/ai';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../styles/PostDetails.css';

function PostDetails() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [likeCount, setLikeCount] = useState(0);
    const [userLiked, setUserLiked] = useState(false);
    const [commentInput, setCommentInput] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        if (!token) {
            navigate('/login'); // Redirect to login page if token is not available
        } else {
            const fetchPost = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/${postId}`);
                    setPost(response.data);
                    const comments = await fetchComments();
                    setComments(comments);
                    const { likes, userLiked } = await fetchLikeCount();
                    setLikeCount(likes);
                    setUserLiked(userLiked);
                } catch (error) {
                    console.error('Error fetching post:', error);
                }
            };
    
            fetchPost();
        }
    }, [postId, token, navigate]);

    const createComment = async () => {
        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/posts/${postId}/create-comment`,
                { text: commentInput },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );
            setCommentInput('');
            const comments = await fetchComments();
            setComments(comments);
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/posts/${postId}/get-comments`,
                {
                    headers: {
                        Authorization: token
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    };

    const fetchLikeCount = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/posts/${postId}/like-count`,
                {
                    headers: {
                        Authorization: token
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching like count:', error);
            return { likes: 0, userLiked: false };
        }
    };

    const toggleLike = async () => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/posts/${postId}/like`,
                {},
                {
                    headers: {
                        Authorization: token
                    }
                }
            );
            const { message } = response.data;
            if (message === "Like deleted") {
                setLikeCount(prevCount => prevCount - 1);
                setUserLiked(false);
            } else if (message === "Like added") {
                setLikeCount(prevCount => prevCount + 1);
                setUserLiked(true);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleCommentSubmit = async () => {
        try {
            await createComment();
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const parseSteps = (stepsString) => {
        try {
            return JSON.parse(stepsString);
        } catch (error) {
            console.error('Error parsing steps:', error);
            return null;
        }
    };

    const updatedAt = moment(post?.updatedAt);

    return (
        <div className="post-details-container">
            <Link to="/" className="back-link">Back to Home</Link> {/* Add Link to the home page */}
            {post ? (
                <div>
                    <Carousel className="carousel-root" showThumbs={true} thumbWidth={100} thumbHeight={80}>
                        {post.Post_Images.map((image, index) => (
                            <div key={index} className="carousel-slide">
                                <img src={`${process.env.REACT_APP_API_URL}${image.img_uri}`} alt={`image ${index}`} />
                            </div>
                        ))}
                    </Carousel>
                    <div className="post-footer">
                        <div className="like-comment-container">
                            <button onClick={toggleLike}>
                                {userLiked ? <AiFillHeart /> : <AiOutlineHeart />}
                            </button>
                            <span className="like-count">{likeCount}</span>
                        </div>
                        <button>
                            <AiOutlineComment />
                        </button>
                    </div>

                    <div className="post-header">
                        <div className="user-info">
                            {post.User.img_uri ? (
                                <img src={`${process.env.REACT_APP_API_URL}${post.User.img_uri}`} alt="User avatar" />
                            ) : (
                                <AiOutlineUser style={{ 
                                    borderRadius: '50%',
                                    backgroundColor: '#f2f2f2',
                                    color: '#666',
                                    padding: '5px',
                                    fontSize: '39px',
                                    marginRight: '8px'
                                }} />   
                            )}
                            <p>{post.User.name}</p>
                        </div>
                        <div className="post-meta">
                            <p>{post.country}, {post.region}</p>
                            <p>{updatedAt.fromNow()}</p>
                        </div>
                    </div>
                    <div className="post-content">
                        <h2>{post.title}</h2>
                        <p>{post.contents}</p>
                    </div>
                    <div className="post-steps">
                        <h3>Steps:</h3>
                        <ul>
                            {post.steps && parseSteps(post.steps).blocks.map((step, index) => (
                                <li key={index}>{step.text}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="comment-input">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentInput}
                            onChange={e => setCommentInput(e.target.value)}
                        />
                        <button onClick={handleCommentSubmit}>Post</button>
                    </div>
                    <div>
                        {comments.map((comment, index) => (
                            <div className="comment" key={index}>
                                <div className="user-info">
                                    {comment.User.img_uri ? (
                                        <img src={`${process.env.REACT_APP_API_URL}${comment.User.img_uri}`} alt="User avatar" className="user-avatar" />
                                    ) : (
                                        <AiOutlineUser style={{ 
                                            borderRadius: '50%',
                                            backgroundColor: '#f2f2f2',
                                            color: '#666',
                                            padding: '5px',
                                            fontSize: '39px',
                                            marginRight: '8px'
                                        }} />                                        

                                    )}
                                    <p>{comment.User.name}</p>
                                </div>
                                <div className="comment-info">
                                    <p className="comment-text">{comment.text}</p>
                                    <p className="comment-date">{moment(comment.createdAt).fromNow()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );

}

export default PostDetails;
