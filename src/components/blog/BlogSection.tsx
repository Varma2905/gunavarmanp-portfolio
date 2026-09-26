import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiClock, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { SectionHeading } from '../ui/SectionHeading';
import { GlassCard } from '../ui/GlassCard';
import { BLOG_POSTS } from '@/lib/constants';

export function BlogSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = ['ALL', 'Agentic AI', 'AI & ML', 'Computer Vision', 'RAG & LLMs'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = activeCategory === 'ALL' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="blog" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          badge="06 // FIELD NOTES"
          title="Engineering Insights &amp; Blog"
          subtitle="In-depth tutorials, system architecture breakdowns, and research notes on generative AI."
        />

        {/* Search Bar & Category Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl font-mono text-xs transition-all duration-300 border ${
                  activeCategory === cat
                    ? 'bg-cyber-blue text-cyber-dark font-bold border-cyber-cyan shadow-[0_0_15px_rgba(230,36,41,0.4)]'
                    : 'bg-cyber-dark/80 text-gray-400 border-cyber-cyan/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyber-cyan" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 bg-cyber-dark/90 border border-cyber-cyan/30 rounded-xl text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan"
            />
          </div>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPosts.map((post, idx) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <GlassCard className="group flex flex-col justify-between h-full border-cyber-cyan/20 hover:border-cyber-cyan/60 p-0 overflow-hidden">
                <div>
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-cyber-dark/30 to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-cyber-dark/80 border border-cyber-cyan/30 text-cyber-cyan font-mono text-[10px]">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs font-mono text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="text-cyber-blue" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="text-cyber-cyan" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-white group-hover:text-cyber-cyan transition-colors mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <a
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyber-blue group-hover:text-cyber-cyan transition-colors"
                  >
                    <span>READ ARTICLE</span>
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
