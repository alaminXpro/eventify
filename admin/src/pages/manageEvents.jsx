import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../utils/axiosInstance';
import Swal from 'sweetalert2';
import { setPageTitle } from '../redux/themeConfigSlice';
import Dropdown from '../components/Dropdown';

const Events = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [publishedEvents, setPublishedEvents] = useState([]);
  const [unpublishedEvents, setUnpublishedEvents] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(setPageTitle('Events'));
    setIsLoading(true);
    fetchEvents();
  }, [limit, page]);

  const fetchEvents = async () => {
    try {
      // Fetch published events
      const publishedRes = await api.get(`/events/published?limit=${limit}&page=${page}`);
      setPublishedEvents(publishedRes.data.results || []);

      // Fetch unpublished events explicitly
      const unpublishedRes = await api.get(`/events?limit=${limit}&page=${page}&event_status=unpublished`);
      setUnpublishedEvents(unpublishedRes.data.results || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      Swal.fire('Error', 'Failed to fetch events.', 'error');
    } finally {
      setIsLoading(false);
    }
  };


  const handleDeleteEvent = async (eventId) => {
    try {
      await api.delete(`/events/${eventId}`);
      fetchEvents();
      Swal.fire('Deleted!', 'Event has been deleted.', 'success');
    } catch (error) {
      console.error('Error deleting event:', error);
      Swal.fire('Error', 'Failed to delete event.', 'error');
    }
  };

  const handleApproveEvent = async (eventId) => {
    try {
      await api.patch(`/events/${eventId}/status`, { event_status: 'published' });

      // Remove approved event from unpublishedEvents
      setUnpublishedEvents(prev => prev.filter(e => e.id !== eventId));

      // Fetch the updated event details
      const { data } = await api.get(`/events/${eventId}`);

      // Add to publishedEvents only if it's not already there
      setPublishedEvents(prev => {
        const exists = prev.some(e => e.id === data.id);
        if (exists) return prev;
        return [data, ...prev];
      });

      Swal.fire('Approved!', 'Event has been approved.', 'success');
    } catch (error) {
      console.error('Error approving event:', error);
      Swal.fire('Error', 'Failed to approve event.', 'error');
    }
  };



  const showAlert = async (type, eventId) => {
    if (type === 'delete') {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonText: 'Delete',
      });

      if (result.isConfirmed) {
        await handleDeleteEvent(eventId);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-5">
        <ol className="flex text-primary font-semibold dark:text-white-dark">
          <li className="bg-[#ebedf2] ltr:rounded-l-md rtl:rounded-r-md dark:bg-[#1b2e4b]">
            <Link to="/" className="p-1.5">Home</Link>
          </li>
          <li className="bg-primary text-white-light">
            <button>Events</button>
          </li>
        </ol>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Unpublished Events */}
          {unpublishedEvents.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Pending Approval</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {unpublishedEvents.map(event => (
                  <div key={event.id} className="relative bg-white shadow-md rounded p-5 dark:bg-[#191e3a]">
                    <h5 className="text-lg font-semibold mb-2 dark:text-white-light">{event.title}</h5>
                    <p className="mb-2 dark:text-[#9CA3AF]">{event.description || 'No description'}</p>
                    <div className="flex space-x-2 rtl:space-x-reverse mt-2">
                      <button
                        onClick={() => handleApproveEvent(event.id)}
                        className="btn btn-success btn-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => showAlert('delete', event.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Published Events */}
          <h3 className="text-lg font-semibold mb-3">Published Events</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {publishedEvents.map(event => (
              <div key={event.id} className="relative bg-white shadow-md rounded p-5 dark:bg-[#191e3a]">
                <div className="dropdown absolute top-2 right-2 z-10">
                  <Dropdown
                    placement="bottom-end"
                    btnClassName="btn btn-secondary dropdown-toggle w-auto h-auto px-2 py-1 text-sm flex items-center"
                    button={<span>Edit</span>}
                  >
                    <ul className="!min-w-[120px]">
                      <li><Link to={`/edit/event/${event.id}`}>Edit</Link></li>
                      <li><button onClick={() => showAlert('delete', event.id)}>Delete</button></li>
                    </ul>
                  </Dropdown>
                </div>
                <h5 className="text-lg font-semibold mb-2 dark:text-white-light">{event.title}</h5>
                <p className="mb-2 dark:text-[#9CA3AF]">{event.description || 'No description'}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-10">
            <button
              disabled={page === 1 || isLoading}
              onClick={() => { setPage(page - 1); setIsLoading(true); }}
              className="btn btn-sm mr-2"
            >
              Prev
            </button>
            <span className="btn btn-sm px-4 py-1">Page {page}</span>
            <button
              disabled={publishedEvents.length < limit || isLoading}
              onClick={() => { setPage(page + 1); setIsLoading(true); }}
              className="btn btn-sm ml-2"
            >
              Next
            </button>
          </div>

          {/* Limit Selector */}
          <div className="flex items-center space-x-2 mt-4">
            <span>Items per page:</span>
            <select
              className="border rounded px-2 py-1"
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); setIsLoading(true); }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default Events;
