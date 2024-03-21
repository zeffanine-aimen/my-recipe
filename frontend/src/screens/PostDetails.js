import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from 'react-icons/ai'; // Importing icons
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../styles/PostDetails.css'; // Import the CSS file

function PostDetails() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [likeCount, setLikeCount] = useState(0);
    const [userLiked, setUserLiked] = useState(false);
    const [commentInput, setCommentInput] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
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
    }, [postId, token]);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/${postId}/comments`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    };

    const fetchLikeCount = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/${postId}/like-count`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching like count:', error);
            return { likes: 0, userLiked: false };
        }
    };

    const handleLikeToggle = async () => {
        // Toggle like action
        try {
            // Call API to toggle like
            setUserLiked(!userLiked); // Toggle userLiked state
            setLikeCount(prevCount => userLiked ? prevCount - 1 : prevCount + 1); // Adjust like count
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleCommentSubmit = async () => {
        // Submit comment action
        try {
            // Call API to submit comment with commentInput value
            setCommentInput(''); // Clear comment input after submission
            // Refetch comments to update UI
            const comments = await fetchComments();
            setComments(comments);
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
            {post ? (
                <div>
                    <div className="post-header">
                        <img src={`${process.env.REACT_APP_API_URL}${post.User.img_uri}`} alt="User avatar" />
                        <p>{post.User.name}</p>
                    </div>
                    <Carousel className="carousel-root" showThumbs={true} thumbWidth={100} thumbHeight={80}>
                        {post.Post_Images.map((image, index) => (
                            <div key={index} className="carousel-slide">
                                <img src={`${process.env.REACT_APP_API_URL}${image.img_uri}`} alt={`image ${index}`} />
                            </div>
                        ))}
                    </Carousel>
                    <div className="post-footer">
                        <button onClick={handleLikeToggle}>
                            {userLiked ? <AiFillHeart /> : <AiOutlineHeart />}
                        </button>
                        <button>
                            <AiOutlineComment />
                        </button>
                    </div>
                    <div className="post-content">
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                        <p>{post.country}, {post.region}</p>
                        <p>{updatedAt.fromNow()}</p>
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
                            <div key={index}>
                                <img src={`${process.env.REACT_APP_API_URL}${comment.User.img_uri}`} alt="User avatar" />
                                <p>{comment.User.name}</p>
                                <p>{comment.text}</p>
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
