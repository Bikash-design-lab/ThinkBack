const Footer: React.FC = () => {
    return (
        <footer>
            <h1>ThinkBack</h1>
            <li>
                <a href="https://github.com/bikash-design-lab/ThinkBack">GitHub</a>
            </li>
            <li>
                <a href="https://linkedln.com/in/bikash-prasad-barnwal">LinkedIn</a>
            </li>
            <li>
                <a href="https://heybikash.vercel.app">Portfolio</a>
            </li>
            <p>© {new Date().getFullYear()} ThinkBack. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
