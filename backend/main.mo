import Hash "mo:base/Hash";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Order "mo:base/Order";

actor {
  // Define the Post type
  type Post = {
    id: Nat;
    title: Text;
    content: Text;
    timestamp: Time.Time;
  };

  // Stable variable to store posts
  stable var posts : [(Nat, Post)] = [];

  // Create a HashMap to store posts
  let postsMap = HashMap.fromIter<Nat, Post>(posts.vals(), 0, Int.equal, Int.hash);

  // Mutable variable for generating unique post IDs
  var nextPostId : Nat = 0;

  // Create a new blog post
  public func createPost(title : Text, content : Text) : async Result.Result<Nat, Text> {
    let postId = nextPostId;
    let timestamp = Time.now();
    let post : Post = {
      id = postId;
      title = title;
      content = content;
      timestamp = timestamp;
    };

    postsMap.put(postId, post);
    nextPostId += 1;

    #ok(postId)
  };

  // Get all blog posts
  public query func getPosts() : async [Post] {
    Array.map<(Nat, Post), Post>(
      Array.sort(
        Iter.toArray(postsMap.entries()),
        func(a : (Nat, Post), b : (Nat, Post)) : Order.Order {
          if (a.1.timestamp > b.1.timestamp) { #less }
          else if (a.1.timestamp < b.1.timestamp) { #greater }
          else { #equal }
        }
      ),
      func(entry : (Nat, Post)) { entry.1 }
    )
  };

  // Get a single blog post by ID
  public query func getPost(id : Nat) : async ?Post {
    postsMap.get(id)
  };

  // System functions for upgrades
  system func preupgrade() {
    posts := Iter.toArray(postsMap.entries());
  };

  system func postupgrade() {
    posts := [];
  };
}
