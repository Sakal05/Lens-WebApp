import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { useRouter } from "next/router";
import fetchProfileQuery from "../../../queries/fetchProfileQuery";
import fetchReactionQuery from "../../../queries/fetchReaction";
import Profile from "../../../components/Profile.js";
import Post from "../../../components/Post.js";
import Button from "react-bootstrap/Button";
import Comment from "../../../components/Comment.js";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const [showPost, updateShowPost] = useState(true);

  const handleShowPostOnClick = () => {
    updateShowPost(true);
  };

  const handleShowCommentOnClick = () => {
    updateShowPost(false);
  };

  console.log("fetching profile for", id);
  const { loading, error, data } = useQuery(fetchProfileQuery, {
    variables: {
      request: { profileId: id },
      publicationsRequest: {
        profileId: id,
        publicationTypes: ["POST", "COMMENT"],
      },
    },
  });

  const { loadingReactions, errorReactions, dataReactions } = useQuery(
    fetchReactionQuery,
    {
      variables: {
        publicationsRequest: { reactionRequest: id },
        reactionRequest: {
          reactionRequest: id,
          publicationTypes: ["POST"],
        },
      },
    }
  );

  console.log("reaction: ", dataReactions);

  console.log("data: ", data);

  if (loading) return "Loading..";
  if (error) return `Error! ${error.message}`;

  return (
    <div className="flex flex-col p-8 items-center">
      <Profile profile={data.profile} displayFullProfile={true} />
      <div className="d-flex align-items-center justify-content-center">
        <Button
          className="m-5"
          variant={showPost ? "primary" : "outline-primary"}
          onClick={handleShowPostOnClick}
        >
          Post
        </Button>
        <Button
          className="m-5"
          variant={!showPost ? "primary" : "outline-primary"}
          onClick={handleShowCommentOnClick}
        >
          Comment
        </Button>
      </div>
      {showPost &&
        data.publications.items
          .filter((item) => item.__typename === "Post")
          .map((post, idx) => {
            return <Post key={idx} post={post} />;
          })}
      {!showPost &&
        data.publications.items
          .filter((item) => item.__typename === "Comment")
          .map((comment, idx) => {
            return <Comment key={idx} post={comment} />;
          })}
    </div>
  );
}
