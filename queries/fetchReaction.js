import { gql } from "@apollo/client";

export default gql`
  query Publications(
    $publicationsRequest: PublicationsQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
  ) {
    publications(request: $publicationsRequest) {
      items {
        __typename
        ... on Post {
          reaction(request: $reactionRequest)
        }
        ... on Comment {
          reaction(request: $reactionRequest)
        }
        ... on Mirror {
          reaction(request: $reactionRequest)
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`;
