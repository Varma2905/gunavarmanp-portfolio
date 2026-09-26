import { useParams } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiCalendar, FiUser } from 'react-icons/fi';
import { BLOG_POSTS, PERSONAL_INFO } from '@/lib/constants';
import { GlassCard } from '@/components/ui/GlassCard';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const post = BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0];

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-28 pb-20 px-6 relative z-10">
      <div className="max-w-4xl mx-auto">

        {/* Back Button */}
        <a
          href="/#blog"
          className="inline-flex items-center gap-2 font-mono text-xs text-cyber-cyan hover:text-white mb-8 group transition-colors"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO BLOG</span>
        </a>

        {/* Post Metadata Header */}
        <div className="mb-8">
          <span className="px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan font-mono text-xs uppercase tracking-wider inline-block mb-4">
            {post.category}
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 font-mono text-xs text-gray-400">
            <span className="flex items-center gap-1.5 text-cyber-cyan">
              <FiUser />
              {PERSONAL_INFO.name}
            </span>
            <span className="flex items-center gap-1.5">
              <FiCalendar className="text-cyber-blue" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <FiClock className="text-cyber-purple" />
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden mb-12 border border-cyber-cyan/30">
          <img
            src={post.image}
            alt={post.title}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>

        {/* Article Body */}
        <GlassCard className="prose prose-invert max-w-none text-gray-300 space-y-6 font-sans">
          <p className="text-lg font-medium text-cyber-cyan leading-relaxed">
            {post.excerpt}
          </p>

          <h2 className="font-display text-2xl font-bold text-white pt-4 border-t border-cyber-cyan/15">
            1. System Architecture Overview
          </h2>
          <p className="leading-relaxed">
            When scaling autonomous AI agents across large production workloads, standard stateless LLM prompt chains quickly run into latency bottlenecks and non-deterministic state drifting. To overcome this, we implement a directed acyclic graph (DAG) routing engine powered by LangGraph.
          </p>

          <h2 className="font-display text-2xl font-bold text-white pt-4 border-t border-cyber-cyan/15">
            2. Memory Persistence &amp; Reranking
          </h2>
          <p className="leading-relaxed">
            Integrating hybrid vector search with BM25 keyword matching ensures sub-100ms retrieval times across millions of technical docs. Cohere cross-encoder reranking eliminates hallucinated noise prior to prompt injection.
          </p>

          <h2 className="font-display text-2xl font-bold text-white pt-4 border-t border-cyber-cyan/15">
            3. Production Benchmarks &amp; Lessons
          </h2>
          <p className="leading-relaxed">
            By combining sandboxed code execution with human-in-the-loop verification gates, error recovery rates reached 99.4% in live enterprise deployments.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
