"use strict";

const { useState, createRef } = React;

const Repository = ({
  name,
  username,
  description,
  rating,
  onRateRepository,
}) => {
  const enableCommentBox = (view = false, username, name) => {
    setPopupEnabled(true);
    setViewComments(view);
    fetchComments(username, name, setComments);
  };

  const submitComment = async (comment) => {
    try {
      await apiSubmitComment(username, name, comment);
    } catch (e) {
      alert("Failed to submit comment");
      console.error("Failed to submit comment: " + e);
    }
  };

  const slider = createRef();
  const [popupEnabled, setPopupEnabled] = useState(false);
  const [viewComments, setViewComments] = useState(false);
  const [editComments, setEditComments] = useState(false);
  const [comments, setComments] = useState([]);

  return (
    <>
      <hr />
      <b>{name}</b>
      <br />

      {description ?? "No description provided"}
      <br />
      <button onClick={() => enableCommentBox(username, name)}>
        Leave a comment
      </button>
      <button onClick={() => enableCommentBox(true, username, name)}>
        View comments
      </button>
      <button onClick={(e) => onRateRepository(name, slider.current.value)}>
        Rate
      </button>
      <div>
        Slider range: [1-5]
        <br />
        <input type="range" min="1" max="5" defaultValue="2.7" ref={slider} />
        Average rating: {rating}
      </div>

      <>
        {popupEnabled && (
          <>
            <CommentBox
              view={viewComments}
              data={comments}
              closePopup={() => {
                setPopupEnabled(false);
                setViewComments(false);
                setEditComments(false);
              }}
              submitComment={(comment) => submitComment(comment)}
              setEditComment={(_) => {
                setViewComments(false);
                setEditComments(true);
              }}
              shouldEditComment={editComments}
              updateHook={setComments}
            />
          </>
        )}
      </>
      <br />
    </>
  );
};

const SearchForm = ({ event }) => {
  const username = createRef();
  return (
    <>
      <form
        onSubmit={(e) => event(e, username.current.value)}
        action="api/repositories"
        method="GET"
        id="view-repo-form"
      >
        <input
          placeholder="Enter a username"
          type="text"
          name="username"
          id="username"
          ref={username}
        />
        <input type="submit" value="Submit" />
      </form>
    </>
  );
};

const Popup = ({ children }) => {
  return (
    <>
      <div id="overlay" style={{ display: "block" }} />
      <div id="popup" style={{ display: "block" }}>
        {children}
      </div>
    </>
  );
};

const ReadOnlyCommentBox = ({
  data,
  closePopup,
  editComment,
  deleteComment,
  storeCommentMetadata,
}) => {
  return (
    <>
      <Popup>
        <span id="close-popup" onClick={() => closePopup()}>
          &times;
        </span>
        <h2>Comments</h2>
        {data.map(({ comment, name, id }) => (
          <div key={id}>
            <hr />
            <b>Repository: {name} </b>
            <br />
            {comment}
            <br />
            <button onClick={() => deleteComment(name, id)}>Delete</button>
            <button
              onClick={() => {
                editComment();
                storeCommentMetadata({ name: name, id: id, comment: comment });
              }}
            >
              Edit
            </button>
          </div>
        ))}
      </Popup>
    </>
  );
};

const WriteOnlyCommentBox = ({ closePopup, submitComment, editComment }) => {
  const comment = createRef();
  return (
    <>
      <Popup>
        <div>
          <textarea name="comment-box" cols="30" rows="10" ref={comment} />
          <button
            onClick={() => {
              if (editComment) editComment(comment.current.value);
              else submitComment(comment.current.value);

              closePopup();
            }}
            name="submit-comment"
          >
            Submit
          </button>
          <span id="close-popup" onClick={() => closePopup()}>
            &times;
          </span>
        </div>
      </Popup>
    </>
  );
};

const CommentBox = ({
  view,
  data,
  closePopup,
  submitComment,
  setEditComment,
  shouldEditComment,
  updateHook,
}) => {
  // Save the state of the comment a user is editing.
  // This allows us to index the original item in 'data'
  const [editedCommentMetadata, setEditedCommentMetadata] = useState({});

  const deleteComment = async (name, id) => {
    const tmp = [...data];
    apiDeleteComment(name, id);
    updateHook(tmp.filter((comment) => comment.id !== id));
  };

  const editComment = async (comment) => {
    const { comment: metadataComment } = editedCommentMetadata;
    const { name, id } = data.find(
      (element) => metadataComment === element.comment
    );
    apiEditComment(name, id, comment);
  };

  if (view !== true)
    return (
      <WriteOnlyCommentBox
        closePopup={closePopup}
        submitComment={submitComment}
        editComment={shouldEditComment && ((comment) => editComment(comment))}
      />
    );

  return (
    <ReadOnlyCommentBox
      data={data}
      closePopup={closePopup}
      editComment={() => setEditComment()}
      deleteComment={(name, id) => deleteComment(name, id)}
      storeCommentMetadata={(metadata) => {
        console.log(metadata);
        setEditedCommentMetadata(metadata);
      }}
    />
  );
};

function App() {
  const [repos, setRepos] = useState([]);
  const [username, setUsername] = useState("");

  const onSubmitOverride = (e, username) => {
    e.preventDefault();
    setUsername(username);
    fetchRepositories(username, setRepos);
  };

  const onRateRepository = async (repoName, sliderValue) => {
    try {
      await apiRateRepository(username, repoName, sliderValue);
      fetchRepositoryRating(username, repoName, setRepos, repos);
    } catch (e) {
      alert("Failed to update rating!");
      console.error(`Failed to update the rating for ${repoName}: ${e}`);
    }
  };

  return (
    <>
      <SearchForm event={onSubmitOverride} />
      {repos.map(({ name, description, rating }) => (
        <Repository
          key={name}
          name={name}
          username={username}
          description={description}
          rating={rating.average}
          onRateRepository={onRateRepository}
        />
      ))}
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

async function fetchRepositoryRating(username, repoName, updateHook, hookData) {
  const updatedRating = await apiRequest(
    `/api/rate?name=${username}_${repoName}`
  );

  const updatedRepository = hookData.find(({ name }) => name == repoName);
  updatedRepository.rating.average = updatedRating.average;

  updateHook(
    hookData.map((element) => {
      if (element.name === repoName) return updatedRepository;
      return element;
    })
  );
}

async function fetchRepositories(username, updateHook) {
  const data = await apiRequest(`/api/repositories?username=${username}`);
  const tmp = [];

  // Iterate over each repository
  for (const element of data) {
    const { name, description } = JsonToObject(element);

    // Request the "like status" of every repository
    const rating = await apiRequest(`/api/rate?name=${username}_${name}`);
    tmp.push({ name: name, description: description, rating: rating });
  }

  updateHook(tmp);
}

// Create a little pop-up window and display all comments for a given repo
const refreshComments = (username, repo) => fetchComments(username, repo);
async function fetchComments(username, repo, updateHook) {
  const data = await apiRequest(`/api/comment?name=${username}_${repo}`);
  const tmp = [];

  // Iterate over each commment
  for (const element of data) {
    tmp.push(JsonToObject(element));
  }

  updateHook(tmp);
}
