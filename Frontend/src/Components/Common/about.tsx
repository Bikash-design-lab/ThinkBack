/**
 * About Page Component
 * 
 * Information about the ThinkBack platform.
 * Data mapped from data.about.json
 */

import aboutData from '../Data/data.about.json';

const About = () => {
    const { project, stack, features, ai_models, security } = aboutData;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
                    {/* Project Header */}
                    <div className="mb-8">
                        <h1 className="text-5xl font-bold text-white mb-3">
                            {project.name}
                        </h1>
                        <p className="text-2xl text-blue-300 mb-4">{project.tagline}</p>
                        <p className="text-gray-300 text-lg">{project.description}</p>
                        <div className="flex gap-4 mt-4 text-sm">
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300"
                            >
                                📦 GitHub
                            </a>
                            <span className="text-gray-400">Author: {project.author}</span>
                        </div>
                    </div>

                    {/* Features Section */}
                    <section className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-6">🎯 Key Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {features.map((feature) => (
                                <div
                                    key={feature.id}
                                    className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-blue-400/30 transition-all"
                                >
                                    <h3 className="font-bold text-white text-lg mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-300 text-sm mb-2">
                                        {feature.description}
                                    </p>
                                    <p className="text-gray-400 text-xs italic">
                                        {feature.detail}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Technology Stack */}
                    <section className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-6">⚙️ Technology Stack</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Frontend */}
                            <div className="bg-gradient-to-br from-blue-500/10 to-blue-700/10 border border-blue-400/20 rounded-lg p-5">
                                <h3 className="font-bold text-blue-300 mb-3 text-lg">Frontend</h3>
                                <ul className="text-sm space-y-2 text-gray-300">
                                    <li>📦 {stack.frontend.framework}</li>
                                    <li>⚡ {stack.frontend.bundler}</li>
                                    <li>🔷 {stack.frontend.language}</li>
                                </ul>
                            </div>

                            {/* Backend */}
                            <div className="bg-gradient-to-br from-green-500/10 to-green-700/10 border border-green-400/20 rounded-lg p-5">
                                <h3 className="font-bold text-green-300 mb-3 text-lg">Backend</h3>
                                <ul className="text-sm space-y-2 text-gray-300">
                                    <li>🚀 {stack.backend.framework}</li>
                                    <li>🐍 {stack.backend.language}</li>
                                    <li>🌐 {stack.backend.server}</li>
                                    <li>📡 {stack.backend.streaming}</li>
                                </ul>
                            </div>

                            {/* Database */}
                            <div className="bg-gradient-to-br from-purple-500/10 to-purple-700/10 border border-purple-400/20 rounded-lg p-5">
                                <h3 className="font-bold text-purple-300 mb-3 text-lg">Database</h3>
                                <ul className="text-sm space-y-2 text-gray-300">
                                    <li>🗄️ {stack.database.name}</li>
                                    <li>🔌 {stack.database.driver}</li>
                                </ul>
                                <p className="text-xs text-gray-400 mt-2 italic">
                                    {stack.database.note}
                                </p>
                            </div>

                            {/* AI */}
                            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-700/10 border border-yellow-400/20 rounded-lg p-5">
                                <h3 className="font-bold text-yellow-300 mb-3 text-lg">AI Engine</h3>
                                <ul className="text-sm space-y-2 text-gray-300">
                                    <li>🤖 {stack.ai.provider}</li>
                                    <li>📚 {stack.ai.sdk}</li>
                                    <li>🔗 {stack.ai.mode}</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* AI Models */}
                    <section className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-6">🧠 AI Models</h2>
                        <div className="space-y-3">
                            {ai_models.map((model) => (
                                <div
                                    key={model.id}
                                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/8 transition-all"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-white font-bold">{model.provider}</span>
                                                <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                                                    {model.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-1 font-mono">
                                                {model.id}
                                            </p>
                                            <p className="text-gray-300 text-sm">
                                                {model.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Security */}
                    <section className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-6">🔒 Security Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <h3 className="font-bold text-white mb-2">CORS Protection</h3>
                                <p className="text-gray-300 text-sm mb-1">
                                    ✅ {security.cors.middleware}
                                </p>
                                <p className="text-gray-400 text-xs">
                                    {security.cors.source}
                                </p>
                            </div>

                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <h3 className="font-bold text-white mb-2">Rate Limiting</h3>
                                <p className="text-gray-300 text-sm mb-1">
                                    ✅ {security.rate_limiting.package} v{security.rate_limiting.version}
                                </p>
                                <p className="text-gray-400 text-xs">
                                    Per-IP protection
                                </p>
                            </div>

                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <h3 className="font-bold text-white mb-2">Async Database</h3>
                                <p className="text-gray-300 text-sm mb-1">
                                    ✅ {security.async_db.driver}
                                </p>
                                <p className="text-gray-400 text-xs">
                                    {security.async_db.reason}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <div className="text-center pt-6 border-t border-white/10">
                        <p className="text-gray-400 text-sm">
                            Built with ❤️ by <span className="text-white font-semibold">{project.author}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
