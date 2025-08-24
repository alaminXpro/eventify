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
      const publishedRes = await api.get(`/events/published?limit=${limit}&page=${page}`);
      setPublishedEvents(publishedRes.data.results || []);

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
      setUnpublishedEvents(prev => prev.filter(e => e.id !== eventId));
      const { data } = await api.get(`/events/${eventId}`);
      setPublishedEvents(prev => prev.some(e => e.id === data.id) ? prev : [data, ...prev]);
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
      if (result.isConfirmed) await handleDeleteEvent(eventId);
    }
  };

  const Card = ({ event, isUnpublished }) => (
    <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 bg-gradient-to-b from-gray-800 via-gray-900 to-black">
      <Link to={`/events/${event.id}`} className="block">
        {event.event_image && (
          <div className="h-48 w-full relative overflow-hidden">
            <img src={event.event_image} alt={event.title} className="w-full h-full object-cover transform hover:scale-105 transition duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
        )}
        <div className="p-4">
          <h5 className="text-xl font-bold text-white mb-2">{event.title}</h5>
          <p className="text-gray-300 text-sm line-clamp-2">{event.description || 'No description'}</p>
        </div>
      </Link>
      {isUnpublished && (
        <div className="flex justify-between p-3 border-t border-gray-700 bg-gray-900">
          <button onClick={() => handleApproveEvent(event.id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">Approve</button>
          <button onClick={() => showAlert('delete', event.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Delete</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 p-6">
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
          {unpublishedEvents.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Pending Approval</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {unpublishedEvents.map(event => <Card key={event.id} event={event} isUnpublished />)}
              </div>
            </div>
          )}

          <h3 className="text-lg font-semibold mb-3">Published Events</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {publishedEvents.map(event => <Card key={event.id} event={event} />)}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-10 space-x-2">
            <button
              disabled={page === 1 || isLoading}
              onClick={() => { setPage(page - 1); setIsLoading(true); }}
              className="btn btn-sm"
            >Prev</button>
            <span className="btn btn-sm px-4 py-1">Page {page}</span>
            <button
              disabled={publishedEvents.length < limit || isLoading}
              onClick={() => { setPage(page + 1); setIsLoading(true); }}
              className="btn btn-sm"
            >Next</button>
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
