import { useState, useEffect } from 'react';
import { useAuth } from "../AuthContext";
import { useTranslation } from "react-i18next";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaSortAmountUpAlt, FaSortAmountDown } from "react-icons/fa";
import { FaCommentDots, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { showToast } from "../components/Toasts/ToastMessages";
import { useToast } from "../components/Toasts/ToastService";
import '../index.css';
import '../App.css';

// Constants for backend connection if needed in the future
const API_HOST = "127.0.0.1";
const API_PORT = 5000;

function Forum() {
  const { t } = useTranslation();
  const { userType } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  // User type flags for conditional rendering
  const isLoggedIn = userType && userType !== "guest"; 
  
  const [topics, setTopics] = useState([]);
  const [copyTopics, setCopyTopics] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(localStorage.getItem('order') || 'ascending');
  const [likedPosts, setLikedPosts] = useState([]);
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  const [newTopic, setNewTopic] = useState({
    title: "",
    content: "",
    category: "general"
  });
  const [lastIndex,setLastIndex] = useState(Object.keys(topics).length);

  useEffect(()=>{
    console.log(lastIndex)
  },[lastIndex])

  useEffect(() => {
    const fetchTopics = async () => {


      try {
        // Replace with actual API call
        const res = await fetch("http://localhost:5000/threads/");
        const data = await res.json();
                
        const topicsArray = Object.values(data)

        setTopics(topicsArray);
        setCopyTopics(topicsArray);
        
        // Fetch liked posts from local storage or API
        const likedFromStorage = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        setLikedPosts(likedFromStorage);
        
      } catch (error) {
        console.error("Failed to fetch forum topics:", error);
      }
    };

    fetchTopics();
  }, []); // No external dependencies needed

  useEffect(()=>{
    console.log(topics)
    setLastIndex(Object.keys(topics).length)

  },[topics])
  
  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    setSearch(searchText);

    if (searchText === "") {
      setCopyTopics(topics);
    } else {
      const filteredTopics = topics.filter(
        (topic) =>
          topic.title?.toLowerCase().includes(searchText) ||
          topic.content?.toLowerCase().includes(searchText) ||
          topic.tags?.some(tag => tag.toLowerCase().includes(searchText))
      );
      setCopyTopics(filteredTopics);
    }
  };

  const handleClick = (sortType) => {
    if (sortType === "order") {
      const newOrder = order === "ascending" ? "descending" : "ascending";
      setOrder(newOrder);
      localStorage.setItem("order", newOrder);
      return;
    }
    
    localStorage.setItem("sorted", sortType);
    
    const sortedTopics = [...copyTopics].sort((a, b) => {
      let comparison = 0;
      
      if (sortType === "Activity") {
        comparison = b.replies - a.replies;
      } else if (sortType === "Category") {
        comparison = a.category?.localeCompare(b.category) || 0;
      } else if (sortType === "Date") {
        comparison = new Date(b.datePosted) - new Date(a.datePosted);
      } else if (sortType === "Popularity") {
        comparison = b.likes - a.likes;
      }
      
      return order === "ascending" ? comparison : -comparison;
    });
    
    setCopyTopics(sortedTopics);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const handleLike = (topicId) => {
    if (!isLoggedIn) {
      showToast(toast, {
        type: "info",
        header: t("forum.loginRequired"),
        message: t("forum.loginToInteract")
      });
      return;
    }

    // Check if already liked
    const isLiked = likedPosts.includes(topicId);
    
    let updatedTopics = [...topics];
    let updatedLikedPosts = [...likedPosts];
    
    // Find the topic and update its likes
    const topicIndex = updatedTopics.findIndex(topic => topic.id === topicId);
    if (topicIndex !== -1) {
      if (isLiked) {
        // Unlike
        updatedTopics[topicIndex].likes -= 1;
        updatedLikedPosts = updatedLikedPosts.filter(id => id !== topicId);
      } else {
        // Like
        updatedTopics[topicIndex].likes += 1;
        updatedLikedPosts.push(topicId);
      }
      
      setTopics(updatedTopics);
      setCopyTopics([...copyTopics].map(topic => 
        topic.id === topicId ? updatedTopics[topicIndex] : topic
      ));
      setLikedPosts(updatedLikedPosts);
      
      // Save to local storage
      localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts));
      
      // In a real app, also send the update to server
      // postLikeToServer(topicId, !isLiked);
    }
  };

  const handleViewTopic = (topicId) => {
    // In a real app, navigate to topic detail page
    // navigate(`/forum/topic/${topicId}`);
    console.log("Viewing topic:", topicId);
    
    showToast(toast, {
      type: "info",
      header: "Topic View",
      message: "Viewing topic details would be implemented in a real app"
    });
    navigate("/forum/forum"+topicId)
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTopic(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewTopic = (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      showToast(toast, {
        type: "error",
        header: t("forum.loginRequired"),
        message: t("forum.loginToPost")
      });
      return;
    }
    
    if (!newTopic.title || !newTopic.content) {
      showToast(toast, {
        type: "error",
        header: t("forum.invalidForm"),
        message: t("forum.fillAllFields")
      });
      return;
    }
    
    // Create a new topic
    const createdTopic = {
      id: (lastIndex+1).toString(),
      title: newTopic.title,
      content: newTopic.content,
      author: userType==='landlord'?"Sr. Danilo":"Matteo Rossi",
      authorId: userType==='landlord'?"supreme_landlord@gmail.com":"thestudent@gmail.com",
      authorType: userType,
      category: newTopic.category,
      datePosted: new Date().toISOString(),
      likes: 0,
      replies: 1,
      tags: [userType==='landlord'?"Landlord":"Student"]
    };
    
    // Update topics state
    const updatedTopics = [createdTopic, ...topics];
    setTopics(updatedTopics);
    setCopyTopics(updatedTopics);
    
    // Reset form
    setNewTopic({
      title: "",
      content: "",
      category: "general"
    });
    setShowNewTopicForm(false);
    
    // Show success message
    showToast(toast, {
      type: "success",
      header: t("forum.success"),
      message: t("forum.topicCreated")
    });
    
    // In a real app, also send the new topic to server
    // postNewTopicToServer(createdTopic);
  };

  // Forum categories for filtering
  const categories = [
    { id: "all", label: t("forum.allCategories") || "All Categories" },
    { id: "general", label: t("forum.general") || "General" },
    { id: "advice", label: t("forum.advice") || "Advice" },
    { id: "discussion", label: t("forum.discussion") || "Discussion" },
    { id: "legal", label: t("forum.legal") || "Legal" },
    { id: "complaint", label: t("forum.complaint") || "Complaint" }
  ];

  // Filter by category
  const handleCategoryFilter = (categoryId) => {
    if (categoryId === "all") {
      setCopyTopics(topics);
    } else {
      const filteredTopics = topics.filter(topic => topic.category === categoryId);
      setCopyTopics(filteredTopics);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-4">
        {/* Search and Filters Header */}
        <div className="w-full max-w-4xl p-4 flex flex-col md:flex-row">
          <div className="relative flex-grow mb-2 md:mb-0">
            <input
              type="text"
              placeholder={t("forum.search") || "Search topics..."}
              className="w-full p-2 pl-10 border border-gray-300 rounded-md"
              value={search}
              onChange={handleSearch}
            />
            <FaMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="flex items-center ml-0 md:ml-4 mt-2 md:mt-0">
            <button
              className={`px-3 py-1 border-2 border-r-0 rounded-l bg-gray-200 hover:bg-gray-300 cursor-pointer text-sm 
                ${localStorage.getItem("sorted")==="Activity"?"bg-gray-300":"bg-gray-200"}`}
              onClick={() => handleClick("Activity")}
            >
              {t("forum.activity") || "Activity"}
            </button>
            <button
              className={`px-3 py-1 border-t-2 border-b-2 bg-gray-200 hover:bg-gray-300 cursor-pointer text-sm 
                ${localStorage.getItem("sorted")==="Category"?"bg-gray-300":"bg-gray-200"}`}
              onClick={() => handleClick("Category")}
            >
              {t("forum.category") || "Category"}
            </button>
            <button
              className={`px-3 py-1 border-t-2 border-b-2 border-r-0 bg-gray-200 hover:bg-gray-300 cursor-pointer text-sm 
                ${localStorage.getItem("sorted")==="Date"?"bg-gray-300":"bg-gray-200"}`}
              onClick={() => handleClick("Date")}
            >
              {t("forum.date") || "Date"}
            </button>
            <button
              className={`px-3 py-1 border-t-2 border-b-2 border-r-2 rounded-r bg-gray-200 hover:bg-gray-300 cursor-pointer text-sm 
                ${localStorage.getItem("sorted")==="Popularity"?"bg-gray-300":"bg-gray-200"}`}
              onClick={() => handleClick("Popularity")}
            >
              {t("forum.popularity") || "Popularity"}
            </button>
            <button
              className={`px-2 ml-2 py-1 border-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer
                ${localStorage.getItem("sorted")?"bg-gray-300":"bg-gray-200"}`}
              onClick={() => handleClick("order")}
            >
              {order === 'descending' ? <FaSortAmountDown /> : <FaSortAmountUpAlt />}               
            </button>
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="w-full max-w-4xl px-4 mb-2 flex overflow-x-auto">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilter(category.id)}
              className="px-4 py-2 mr-2 whitespace-nowrap rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition"
            >
              {category.label}
            </button>
          ))}
        </div>
        
        {/* New Topic Button */}
        <div className="w-full max-w-4xl px-4 mb-4">
          <button
            onClick={() => isLoggedIn ? setShowNewTopicForm(!showNewTopicForm) : navigate('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FiMessageCircle className="text-lg" />
            {showNewTopicForm ? (t("forum.cancelTopic") || "Cancel") : (t("forum.newTopic") || "New Topic")}
          </button>
        </div>
        
        {/* New Topic Form */}
        {showNewTopicForm && (
          <div className="w-full max-w-4xl px-4 mb-4">
            <form onSubmit={handleSubmitNewTopic} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">{t("forum.createNewTopic") || "Create New Topic"}</h2>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">{t("forum.topicTitle") || "Title"}</label>
                <input
                  type="text"
                  name="title"
                  value={newTopic.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder={t("forum.enterTitle") || "Enter topic title..."}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">{t("forum.topicCategory") || "Category"}</label>
                <select
                  name="category"
                  value={newTopic.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  {categories.filter(c => c.id !== "all").map(category => (
                    <option key={category.id} value={category.id}>{category.label}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">{t("forum.topicContent") || "Content"}</label>
                <textarea
                  name="content"
                  value={newTopic.content}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md h-32"
                  placeholder={t("forum.enterContent") || "Enter topic content..."}
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTopicForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  {t("forum.cancel") || "Cancel"}
                </button>
                <button
                  type="submit"
                  //ALTERAR AQUI
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {t("forum.createTopic") || "Create Topic"}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Topics List */}
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-4 mb-8">
          <h2 className="text-xl font-semibold mb-4">{t("forum.discussions") || "Discussions"}</h2>
          {copyTopics.length > 0 ? (
            <div className="space-y-4">
              {copyTopics.map((topic,id) => (
                <div key={topic.id} className="border rounded-lg overflow-hidden">
                  <div className="p-4 bg-white">
                    <div className="flex justify-between items-start">
                      <h3 
                        className="text-lg font-medium text-blue-700 hover:text-blue-900 cursor-pointer"
                        onClick={() => handleViewTopic(topic.id)}
                      >
                        {topic.title}
                      </h3>
                      <span className="text-sm text-gray-500">{formatDate(topic.datePosted)}</span>
                    </div>
                    
                    <p className="mt-2 text-gray-700 line-clamp-2">{topic.content}</p>
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      {topic.tags.map((tag, i) => (
                        <span key={i} className="bg-gray-100 px-3 py-1 text-xs rounded-full border">
                          {tag}
                        </span>
                      ))}
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        topic.category === 'general' ? 'bg-gray-100 border-gray-300' :
                        topic.category === 'advice' ? 'bg-blue-100 border-blue-300' :
                        topic.category === 'discussion' ? 'bg-green-100 border-green-300' :
                        topic.category === 'legal' ? 'bg-yellow-100 border-yellow-300' :
                        topic.category === 'complaint' ? 'bg-red-100 border-red-300' :
                        'bg-purple-100 border-purple-300'
                      } border`}>
                        {t(`forum.${topic.category}`) || topic.category}
                      </span>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600">
                          {t("forum.by") || "By"} <span className="font-medium">{topic.author}</span> 
                          {topic.authorType === "landlord" && <span className="ml-1 text-blue-600">({t("forum.landlord") || "Landlord"})</span>}
                          {topic.authorType === "tenant" && <span className="ml-1 text-green-600">({t("forum.tenant") || "Tenant"})</span>}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <button
                          className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                          onClick={() => handleLike(topic.id)}
                        >
                          {likedPosts.includes(topic.id) ? 
                            <FaThumbsUp className="text-blue-500" /> : 
                            <FaRegThumbsUp />
                          }
                          <span>{topic.likes}</span>
                        </button>
                        
                        <button
                          className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                          onClick={() => handleViewTopic(topic.id)}
                        >
                          <FaCommentDots />
                          <span>{topic.replies}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">{t("forum.noTopics") || "No topics found"}</p>
              {isLoggedIn ? (
                <button
                  onClick={() => setShowNewTopicForm(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  {t("forum.startDiscussion") || "Start a discussion"}
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  {t("forum.loginToStart") || "Login to start a discussion"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Forum;