const getPost = (postId, state) => state.feedsData.posts.find((post) => post.guid === postId);

export const modalHandler = (state) => (event) => {
  const button = event.relatedTarget;
  const { postid } = button.dataset;
  const selectedPost = getPost(postid, state);
  state.checkedPostsIds.push(postid);
  state.selectedPost = selectedPost;
};
