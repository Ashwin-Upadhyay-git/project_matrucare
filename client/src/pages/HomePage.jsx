import { ArrowRight, CheckCircle2, Trophy, Users, BriefcaseBusiness } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EVENT_CONFIG } from '../constants/eventConfig';

const HomePage = () => (
  <div>
    <section className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div className="flex flex-col justify-center">
          <div className="mb-4 inline-flex w-fit rounded-full border border-indigo-400/50 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-200">
            AI for meaningful real-world impact
          </div>
          <h1 className="max-w-xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {EVENT_CONFIG.eventTitle}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-300">
            {EVENT_CONFIG.subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link to="/signup" className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white transition hover:bg-indigo-400">
              {EVENT_CONFIG.heroCtaPrimary} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-semibold text-white transition hover:border-slate-500">
              {EVENT_CONFIG.heroCtaSecondary}
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-indigo-950/30">
            <div className="grid gap-4 sm:grid-cols-2">
              {EVENT_CONFIG.eventHighlights.map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
                  <CheckCircle2 className="mb-3 h-5 w-5 text-indigo-300" />
                  <p className="text-sm text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Event highlights</p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900">What makes this hackathon exciting</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Users className="mb-4 h-9 w-9 text-indigo-600" />
          <h3 className="text-xl font-semibold text-slate-900">Collaborative teams</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">Compete and co-create with builders, engineers, and designers in a high-energy problem-solving environment.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <BriefcaseBusiness className="mb-4 h-9 w-9 text-indigo-600" />
          <h3 className="text-xl font-semibold text-slate-900">Practical product building</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">Turn ideas into working prototypes with a strong focus on product thinking, UX, and technical execution.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Trophy className="mb-4 h-9 w-9 text-indigo-600" />
          <h3 className="text-xl font-semibold text-slate-900">Recognition and rewards</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">Pitch your solution to mentors and judges while competing for recognition and prize rewards.</p>
        </div>
      </div>
    </section>

    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-slate-900">Event timeline</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {EVENT_CONFIG.timeline.map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <div className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">{idx + 1}</div>
              <h3 className="text-xl font-semibold text-slate-900">{item.label}</h3>
              <p className="mt-3 text-sm text-slate-600">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-700">Prizes</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Recognize innovation</h2>
          </div>
          <Link to="/signup" className="inline-flex rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800">Get started</Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {EVENT_CONFIG.prizes.map((prize, idx) => (
            <div key={idx} className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">{prize.title}</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">{prize.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section id="about" className="bg-slate-950 px-4 py-16 text-slate-200 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">About</p>
          <h2 className="mt-3 text-3xl font-bold text-white">A technology challenge built around real AI impact</h2>
        </div>
        <p className="text-base leading-7 text-slate-300">{EVENT_CONFIG.about}</p>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Eligibility</p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900">Who can participate</h2>
        <p className="mt-5 max-w-3xl text-slate-600">{EVENT_CONFIG.eligibility}</p>
      </div>
    </section>
  </div>
);

export default HomePage;
