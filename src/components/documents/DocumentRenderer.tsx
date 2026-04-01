import React from 'react';
import Markdown from 'react-markdown';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Users, DollarSign, Calendar, TrendingUp, Info, CheckCircle2, MapPin, Clock, User } from 'lucide-react';

interface DocumentRendererProps {
  type: string;
  content: string;
  eventDetails?: any;
}

const COLORS = ['#4f46e5', '#818cf8', '#c7d2fe', '#e0e7ff', '#f5f3ff'];

export function DocumentRenderer({ type, content, eventDetails }: DocumentRendererProps) {
  const t = type.toLowerCase();

  // Helper to parse JSON content safely
  const parseJSON = (jsonStr: string) => {
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse JSON content:', e);
      return null;
    }
  };

  if (t === 'flyer') {
    return <FlyerRenderer content={content} eventDetails={eventDetails} />;
  }

  if (t === 'attendance') {
    return <AttendanceRenderer eventDetails={eventDetails} />;
  }

  if (t === 'budget') {
    const data = parseJSON(content);
    return data ? <BudgetRenderer data={data} /> : <MarkdownRenderer content={content} />;
  }

  if (t === 'timeline') {
    const data = parseJSON(content);
    return data ? <TimelineRenderer data={data} /> : <MarkdownRenderer content={content} />;
  }

  if (t === 'analytics') {
    const data = parseJSON(content);
    return data ? <AnalyticsRenderer data={data} /> : <MarkdownRenderer content={content} />;
  }

  if (t === 'summary') {
    const data = parseJSON(content);
    return data ? <SummaryRenderer data={data} /> : <MarkdownRenderer content={content} />;
  }

  return <MarkdownRenderer content={content} />;
}

function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div 
      className="markdown-body prose prose-indigo max-w-4xl mx-auto p-12 bg-white shadow-2xl rounded-2xl border border-gray-100 min-h-full outline-none"
      contentEditable
      suppressContentEditableWarning
    >
      <Markdown>{content}</Markdown>
    </div>
  );
}

function FlyerRenderer({ content, eventDetails }: { content: string; eventDetails?: any }) {
  return (
    <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100 relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
        <img 
          src="https://picsum.photos/seed/event/1200/1600" 
          alt="Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-12 text-center text-white relative z-10">
        <h1 className="text-6xl font-display uppercase mb-4 leading-none tracking-tighter">
          {eventDetails?.event_name || 'THE EVENT'}
        </h1>
        <p className="text-xl font-serif italic text-indigo-100 tracking-widest uppercase">
          {eventDetails?.theme || 'Join us for an unforgettable experience'}
        </p>
      </div>

      <div className="p-10 space-y-10 relative z-10">
        <div 
          className="markdown-body prose prose-indigo max-w-none text-center outline-none"
          contentEditable
          suppressContentEditableWarning
        >
          <Markdown>{content}</Markdown>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-2xl flex items-center gap-4 border border-gray-100">
            <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date & Time</p>
              <p className="text-sm font-bold text-gray-900">{eventDetails?.date || 'TBD'}</p>
              <p className="text-xs text-gray-500">{eventDetails?.time || 'TBD'}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl flex items-center gap-4 border border-gray-100">
            <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</p>
              <p className="text-sm font-bold text-gray-900">{eventDetails?.venue || 'TBD'}</p>
            </div>
          </div>
        </div>

        {eventDetails?.speaker && (
          <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">Featured Speaker</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-xl">
                {eventDetails.speaker[0]}
              </div>
              <div>
                <p className="font-bold text-gray-900">{eventDetails.speaker}</p>
                <p className="text-sm text-indigo-600">Keynote Guest</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center pt-6">
          <button className="px-10 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 transform hover:-translate-y-1">
            Register Now
          </button>
          <p className="mt-4 text-xs text-gray-400 font-medium">
            Organized by {eventDetails?.organizer || 'EventForge AI'}
          </p>
        </div>
      </div>
    </div>
  );
}

function AttendanceRenderer({ eventDetails }: { eventDetails?: any }) {
  const rows = Array.from({ length: 30 });
  
  return (
    <div className="bg-white p-12 shadow-lg rounded-xl border border-gray-200 print:shadow-none print:border-none">
      <div className="border-b-2 border-gray-900 pb-6 mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight mb-2">
          {eventDetails?.event_name || 'Event'} - Attendance Sheet
        </h1>
        <div className="flex justify-center gap-8 text-sm font-medium text-gray-600">
          <p>Date: {eventDetails?.date || '__________'}</p>
          <p>Venue: {eventDetails?.venue || '__________'}</p>
          <p>Organizer: {eventDetails?.organizer || '__________'}</p>
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 p-2 text-xs font-bold uppercase w-12">S.No</th>
            <th className="border border-gray-300 p-2 text-xs font-bold uppercase">Name</th>
            <th className="border border-gray-300 p-2 text-xs font-bold uppercase w-32">Roll No/ID</th>
            <th className="border border-gray-300 p-2 text-xs font-bold uppercase w-32">Dept/Year</th>
            <th className="border border-gray-300 p-2 text-xs font-bold uppercase w-32">Contact</th>
            <th className="border border-gray-300 p-2 text-xs font-bold uppercase">Email</th>
            <th className="border border-gray-300 p-2 text-xs font-bold uppercase w-32">Signature</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((_, i) => (
            <tr key={i} className="h-10">
              <td className="border border-gray-300 p-2 text-center text-xs text-gray-500">{i + 1}</td>
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2"></td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-8 flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
        <p>Verified By: ____________________</p>
        <p>Stamp: ____________________</p>
      </div>
    </div>
  );
}

function BudgetRenderer({ data }: { data: any }) {
  return (
    <div className="bg-white p-8 shadow-lg rounded-xl border border-gray-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-green-100 p-3 rounded-xl text-green-600">
          <DollarSign size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Budget Breakdown</h2>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Item</th>
              <th className="p-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Estimated Cost</th>
              <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.items.map((item: any, i: number) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 text-sm font-semibold text-indigo-600">{item.category}</td>
                <td className="p-4 text-sm text-gray-900">{item.item}</td>
                <td className="p-4 text-sm font-bold text-right text-gray-900">${item.estimated_cost.toLocaleString()}</td>
                <td className="p-4 text-xs text-gray-500 italic">{item.notes || '-'}</td>
              </tr>
            ))}
            <tr className="bg-indigo-50 font-bold">
              <td colSpan={2} className="p-4 text-indigo-700 uppercase tracking-widest text-xs">Total Estimated Cost</td>
              <td className="p-4 text-right text-indigo-700 text-lg">${data.total_cost.toLocaleString()}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Cost Efficiency</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">${data.cost_per_participant}</span>
            <span className="text-sm text-gray-500">per participant</span>
          </div>
        </div>
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">Cost-Saving Tips</h3>
          <ul className="space-y-2">
            {data.cost_saving_tips.map((tip: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-indigo-700">
                <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function TimelineRenderer({ data }: { data: any }) {
  return (
    <div className="bg-white p-8 shadow-lg rounded-xl border border-gray-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
          <Clock size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Event Schedule</h2>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-32">Time</th>
              <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Activity</th>
              <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-24">Duration</th>
              <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Responsible</th>
              <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.schedule.map((item: any, i: number) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 text-sm font-bold text-indigo-600">{item.time}</td>
                <td className="p-4 text-sm font-semibold text-gray-900">{item.activity}</td>
                <td className="p-4 text-xs text-gray-500">{item.duration}</td>
                <td className="p-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-gray-400" />
                    {item.responsible_person}
                  </div>
                </td>
                <td className="p-4 text-xs text-gray-500 italic">{item.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsRenderer({ data }: { data: any }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Estimated Reach</p>
          <p className="text-3xl font-black text-indigo-600">{data.stats.estimated_reach.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Engagement Score</p>
          <p className="text-3xl font-black text-violet-600">{data.stats.engagement_score}%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Expected Attendance</p>
          <p className="text-3xl font-black text-emerald-600">{data.stats.expected_attendance_rate}%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Impact Score</p>
          <p className="text-3xl font-black text-amber-600">{data.stats.impact_score}/10</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-8">Budget Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.charts.budget_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.charts.budget_distribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-8">Engagement Metrics</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.charts.engagement_metrics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
          <TrendingUp size={18} className="text-indigo-600" />
          Strategic Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.recommendations.map((rec: string, i: number) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="bg-white p-1.5 rounded-lg shadow-sm text-indigo-600">
                <Info size={16} />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryRenderer({ data }: { data: any }) {
  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg">
        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">Executive Summary</h3>
        <p className="text-2xl text-gray-900 leading-relaxed font-serif italic">"{data.one_paragraph}"</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg flex flex-col">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Newsletter Version</h3>
          <div className="text-sm text-gray-700 leading-relaxed flex-1 whitespace-pre-wrap">
            {data.newsletter}
          </div>
          <button className="mt-6 w-full py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-all">
            Copy for Email
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg flex flex-col">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Social Media Post</h3>
          <div className="text-sm text-gray-700 leading-relaxed flex-1 whitespace-pre-wrap italic">
            {data.social_media}
          </div>
          <button className="mt-6 w-full py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-all">
            Copy for Social
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg flex flex-col">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Internal Memo</h3>
          <div className="text-sm text-gray-700 leading-relaxed flex-1 whitespace-pre-wrap">
            {data.memo}
          </div>
          <button className="mt-6 w-full py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-all">
            Copy for Slack/Teams
          </button>
        </div>
      </div>
    </div>
  );
}
