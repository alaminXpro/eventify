import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { setPageTitle } from "../redux/themeConfigSlice";

const Clubs = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [clubs, setClubs] = useState([]);
  const [limit, setLimit] = useState(12);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [membershipStatus, setMembershipStatus] = useState({});
  const [showMyClubsOnly, setShowMyClubsOnly] = useState(false);
  console.log(currentUser)

  // Helper function to check if user is enrolled in a club
  const isUserEnrolled = (clubId) => {
    return currentUser?.clubs?.includes(clubId) || membershipStatus[clubId] === 'enrolled';
  };

  // Helper function to check if user has pending request
  const isUserPending = (clubId) => {
    return membershipStatus[clubId] === 'pending';
  };

  const fetchClubs = useCallback(async () => {
    setIsLoading(true);
    try {
      let url = `/clubs?limit=${limit}&page=${page}`;
      
      // Add userId filter if showing only user's clubs
      if (showMyClubsOnly && currentUser?.id) {
        url += `&userId=${currentUser.id}`;
      }
      
      const response = await api.get(url);
      if (response.data.results.length === 0) {
        toast.info(
          showMyClubsOnly 
            ? "You haven't joined any clubs yet."
            : "No Clubs Found — There are no clubs associated with this admin."
        );
      } else {
        setClubs(response.data.results);
        setTotalPages(response.data.totalPages || 1);
        setTotalResults(response.data.totalResults || 0);
        
        // If showing only user's clubs, mark all as enrolled
        if (showMyClubsOnly) {
          const statusMap = {};
          response.data.results.forEach(club => {
            statusMap[club.id] = 'enrolled';
          });
          setMembershipStatus(statusMap);
        } else {
          // Clear membership status when showing all clubs
          setMembershipStatus({});
        }
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
      toast.error("Failed to fetch clubs.");
    } finally {
      setIsLoading(false);
    }
  }, [limit, page, currentUser?.id, showMyClubsOnly]);

  useEffect(() => {
    dispatch(setPageTitle("Clubs"));
    fetchClubs();
  }, [dispatch, fetchClubs]);

  useEffect(() => {
    // Filter clubs based on search term
    if (searchTerm) {
      const filtered = clubs.filter(club => 
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClubs(filtered);
    } else {
      setFilteredClubs(clubs);
    }
  }, [clubs, searchTerm]);

  const handleJoinClub = async (clubId) => {
    if (!currentUser) {
      toast.error("Please login to join clubs.");
      return;
    }

    try {
      const response = await api.post(`/clubs/join`, {
        clubId: clubId,
      });
      
      if (response.data.status === "enrolled") {
        toast.info("Already Enrolled — You are already a member of this club.");
        // Update local status
        setMembershipStatus(prev => ({ ...prev, [clubId]: 'enrolled' }));
      } else if (response.data.status === "pending") {
        toast.info("Pending Approval — Your request to join this club is pending approval.");
        // Update local status
        setMembershipStatus(prev => ({ ...prev, [clubId]: 'pending' }));
      } else {
        toast.success(response.data.message || "Successfully requested to join the club!");
        // Update local status
        setMembershipStatus(prev => ({ ...prev, [clubId]: 'pending' }));
      }
    } catch (error) {
      console.error("Error joining club:", error);
      toast.error(error.response?.data?.message || "Failed to join club.");
    }
  };

  // Function to get button content based on membership status
  const getJoinButtonContent = (club) => {
    if (isUserEnrolled(club.id)) {
      return {
        text: "Enrolled",
        icon: (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
        ),
        className: "bg-emerald-500 hover:bg-emerald-600 text-white cursor-default",
        disabled: true
      };
    } else if (isUserPending(club.id)) {
      return {
        text: "Pending",
        icon: (
          <svg className="w-4 h-4 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        ),
        className: "bg-yellow-500 hover:bg-yellow-600 text-white cursor-default",
        disabled: true
      };
    } else {
      return {
        text: "Join Club",
        icon: (
          <svg className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
          </svg>
        ),
        className: "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white",
        disabled: false
      };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      {/* Modern Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              Home
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
            </svg>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">Clubs</span>
          </nav>
        </div>
      </div>

      {/* Header Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Discover Amazing Clubs
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Join vibrant communities, learn new skills, and connect with like-minded people at AUST
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/70 backdrop-blur-sm dark:bg-gray-800/70 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search clubs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white/80 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700/80 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-all duration-200"
                />
              </div>
              
              {currentUser && (
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showMyClubsOnly}
                      onChange={(e) => {
                        setShowMyClubsOnly(e.target.checked);
                        setPage(1); // Reset to first page when toggling
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">My Clubs</span>
                  </label>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Items per page:</span>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white/80 dark:bg-gray-700/80 dark:border-gray-600 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={18}>18</option>
                <option value={24}>24</option>
              </select>
            </div>
          </div>
          
          {searchTerm && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredClubs.length} results for "{searchTerm}"
              {showMyClubsOnly && " in your clubs"}
            </div>
          )}
          
          {showMyClubsOnly && !searchTerm && (
            <div className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 font-medium">
              Showing only clubs you're a member of
            </div>
          )}
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {isLoading
            ? // Enhanced Skeleton loader
              Array.from({ length: limit }).map((_, index) => (
                <div key={index} className="group">
                  <div className="bg-white/70 backdrop-blur-sm dark:bg-gray-800/70 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden animate-pulse">
                    <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-16 mb-3"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4 mb-3"></div>
                      <div className="space-y-2 mb-4">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-full"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-5/6"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-4/6"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-24"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : filteredClubs.map((club) => (
                <div key={club.id} className="group">
                  <div className="bg-white/70 backdrop-blur-sm dark:bg-gray-800/70 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 hover:border-indigo-300 dark:hover:border-indigo-600">
                    <div className="relative overflow-hidden">
                      <img
                        src={club.logo || "/assets/images/file-preview.svg"}
                        alt={club.name}
                        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {club.website && (
                        <a
                          href={club.website}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-gray-800"
                        >
                          <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                          </svg>
                        </a>
                      )}
                      <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100">
                          <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                          Active
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100">
                          AUST
                        </span>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span className="text-xs">Verified</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                        {club.name}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                        {club.description}
                      </p>

                      {/* Club Stats */}
                      <div className="flex items-center justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                          </svg>
                          <span>{club.members?.length || 0} members</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path>
                          </svg>
                          <span>{club.moderators?.length || 0} moderators</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <span className="text-sm text-gray-600 dark:text-gray-400">4.8</span>
                        </div>
                        
                        {(() => {
                          const buttonContent = getJoinButtonContent(club);
                          return (
                            <button
                              onClick={() => !buttonContent.disabled && handleJoinClub(club.id)}
                              disabled={buttonContent.disabled}
                              className={`group/btn relative px-4 py-2 text-sm font-medium rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${buttonContent.className} ${buttonContent.disabled ? 'cursor-not-allowed' : 'hover:shadow-indigo-500/25'}`}
                            >
                              <span className="relative z-10 flex items-center">
                                {buttonContent.icon}
                                {buttonContent.text}
                              </span>
                              {!buttonContent.disabled && (
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                              )}
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Enhanced Pagination */}
        {!isLoading && filteredClubs.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm dark:bg-gray-800/70 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-medium">{((page - 1) * limit) + 1}</span> to{" "}
                <span className="font-medium">{Math.min(page * limit, totalResults)}</span> of{" "}
                <span className="font-medium">{totalResults}</span> results
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  Previous
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          page === pageNum
                            ? "bg-indigo-600 text-white shadow-lg"
                            : "text-gray-600 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  Next
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredClubs.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/70 backdrop-blur-sm dark:bg-gray-800/70 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-8 max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.881-6.08 2.33a7.963 7.963 0 01-2.92 1.67A7.975 7.975 0 013 21c0-1.108.24-2.162.674-3.109z"></path>
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? "No clubs found" : "No clubs available"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm 
                  ? `Try adjusting your search terms or browse all clubs.`
                  : "Check back later for new clubs to join."
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubs;
