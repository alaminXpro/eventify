import React, { useState } from 'react';
import api from '../utils/axiosInstance'; // ✅ import your axios instance
import { Search, MessageCircle, Send, Loader2, HelpCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const EventFAQPage = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [faqHistory, setFaqHistory] = useState([]);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Sample predefined FAQs - you can populate these from your backend
  const [predefinedFaqs] = useState([
    {
      id: 1,
      question: "How can I explore available clubs at AUST?",
      answer: "AUST has a variety of student clubs and organizations, including cultural, technical, sports, and social service clubs. You can find information about active clubs on the university notice boards, official website, or social media pages."
    },
    {
      id: 2,
      question: "Are there any events to learn about clubs?",
      answer: "Yes! At the beginning of each semester, many clubs organize fairs or introductory sessions. These events are open to all students and provide an opportunity to learn about club activities and membership requirements."
    },
    {
      id: 3,
      question: "How do I contact a club representative?",
      answer: "Each club has an executive committee or representatives. You can reach out to them directly via email, Facebook groups, or in-person on campus to express your interest in joining."
    },
    {
      id: 4,
      question: "How do I officially join a club?",
      answer: "Most clubs require you to fill out a membership form. This may be available online or in print during club events. After joining, you can participate in regular meetings, workshops, competitions, and other events organized by the club."
    },
    {
      id: 5,
      question: "Do clubs at AUST have membership fees?",
      answer: "Some clubs may require a small membership fee to cover administrative or event costs. Details will be provided by the club."
    },
    {
      id: 6,
      question: "Who is eligible to join AUST clubs?",
      answer: "All AUST students are eligible to join clubs, but some clubs may have specific requirements or selection processes for certain positions. Stay updated with university notices and club announcements for new opportunities."
    }
  ]);

  // ✅ Real API call
  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);

    try {
      const response = await api.post('/faq', { message: question });
      const answer = response.data?.data?.answer || "No answer found.";

      const newFaq = {
        id: Date.now(),
        question: question,
        answer: answer,
        timestamp: new Date().toLocaleString()
      };

      setFaqHistory(prev => [newFaq, ...prev]);
      setQuestion('');
    } catch (error) {
      console.error('Error fetching answer:', error);
      const errorFaq = {
        id: Date.now(),
        question: question,
        answer: "Sorry, I couldn't process your question right now. Please try again later or contact our support team.",
        timestamp: new Date().toLocaleString(),
        isError: true
      };
      setFaqHistory(prev => [errorFaq, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const toggleFaqExpansion = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Event FAQ</h1>
            <p className="text-gray-600">Got questions? We've got answers! Ask anything about the event.</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Ask Question Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Ask a Question</h2>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question here... (Press Enter to send)"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-black"
                rows="3"
                disabled={loading}
              />

            </div>

            <button
              onClick={handleAskQuestion}
              disabled={loading || !question.trim()}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Getting Answer...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Ask Question
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Frequently Asked Questions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Common Questions</h2>
            </div>

            <div className="space-y-3">
              {predefinedFaqs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleFaqExpansion(faq.id)}
                    className="w-full text-left p-4 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {expandedFaq === faq.id ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>

                  {expandedFaq === faq.id && (
                    <div className="px-4 pb-4">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Questions & Answers */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Your Questions</h2>
            </div>

            {faqHistory.length === 0 ? (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No questions asked yet.</p>
                <p className="text-sm text-gray-400 mt-1">Your questions and answers will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {faqHistory.map((faq) => (
                  <div
                    key={faq.id}
                    className={`p-4 rounded-lg border-l-4 ${faq.isError ? 'border-red-400 bg-red-50' : 'border-blue-400 bg-blue-50'
                      }`}
                  >
                    <div className="mb-2">
                      <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                      <p className="text-xs text-gray-500 mt-1">{faq.timestamp}</p>
                    </div>
                    <p className={`text-sm ${faq.isError ? 'text-red-700' : 'text-gray-700'}`}>
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact Info */}
        {/* <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white text-center">
          <h3 className="text-lg font-semibold mb-2">Still need help?</h3>
          <p className="text-blue-100 mb-4">Can't find what you're looking for? Contact our support team.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@yourevent.com"
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              Email Support
            </a>
            <a
              href="tel:+1234567890"
              className="bg-white/20 text-white px-6 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors duration-200"
            >
              Call Us
            </a>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default EventFAQPage;
