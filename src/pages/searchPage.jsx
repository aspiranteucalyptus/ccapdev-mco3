import React, { useEffect, useState } from 'react';
import Header from '@/components/custom/header';
import AnimBackground from '@/components/custom/animBackground';
import PostCard from '@/components/custom/postCard';
import SearchHeader from '@/components/custom/searchHeader';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const SearchPage = () => {
  const [sortBy, setSortBy] = useState("recent");
  const [datePosted, setDatePosted] = useState("Oldest");
	const [popularity, setPopularity] = useState("Lowest");
	const [searchQuery, setSearchQuery] = useState("");
  const [searchRes, setSearchRes] = useState([]);
  const [searchButtonTrigger, setSearchButtonTrigger] = useState(false);
	const [searchTags, setSearchTags] = useState([]);

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const filterPosts = (posts, tags) => {
    console.log("Tags:", tags); 
    
    const filteredPosts = posts.filter(post => {
      return tags.some(tag => post.tags.includes(tag));
    });
		
    console.log("Filtered Posts:", filteredPosts);
    
    return filteredPosts;
  };
  

  const sortPosts = (posts) => {
    switch (sortBy) {
      case "recent":
        return posts.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      case "popular":
        return posts.sort((a, b) => b.views - a.views);
      default:
        return posts;
    }
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        let quer = "?q=";
				quer += searchQuery;
				quer += "&t=";
				for (let i=0; i<searchTags.length; i++) {
					quer += searchTags[i];
					if (i < (searchTags.length - 1)) {
						quer += ",";
					}
				}
				quer += "&do=";
				quer += "&po=";
        const response = await fetch(`/api/search` + quer);
				
        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }
        const searchData = await response.json();
				const filteredPosts = filterPosts(searchData, ["Internet", "Delivery", "Amazon"]);
        setSearchRes(filteredPosts);
				

        console.log("Obtained search results", searchRes);
        
      } 
      catch (error) {
        console.error("Error fetching results:", error);
      }

    };

    fetchSearchResults();
  }, [searchButtonTrigger]);

  return (
    <AnimBackground>
      <div className="w-full h-full bg-background">
        <Header />
          <SearchHeader datePosted={'Oldest'} searchResultsCount={searchRes.length} tags={["Internet", "Delivery", "Amazon"]} />
          
        <div className="flex flex-col gap-2 px-16 py-5">
        {sortPosts(searchRes).map(p => {
                  console.log("Post:", p); 
                  return (
                    <PostCard
                      id={p.id} 
                      key={p.id}
                      title={p.title}
                      author={p.posterId.username}
                      body={p.body}
                      uploadDate={p.uploadDate}
                      views={p.views}
                      likes={p.reactions.likerIds.length}
                      dislikes={p.reactions.dislikerIds.length}
                      userRating={p.reactions.likerIds.includes(0) ? 'like' : 'dislike'}
                      tags={p.tags}
                    />
                  );
                })}
        </div>
        {/* Pagination */}
        <Pagination className="mt-4">
            <PaginationContent>
            <PaginationItem>
                <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
                {/* Make shown posts link based (item no. as param). */}
                <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
                <PaginationNext href="#" />
            </PaginationItem>
            </PaginationContent>
        </Pagination>
      </div>
    </AnimBackground>
  );
};

export default SearchPage;