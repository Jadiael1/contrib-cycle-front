import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ListOfProjects from "@/components/projects/ListOfProjects";
import Hero from "@/pages/Home/Hero";

const Home = () => {
	return (
		<div className="star-dimmin-h-screen stars-bg">
			<Header />
			<Hero />
			<ListOfProjects />
			<Footer />
		</div>
	);
};

export default Home;
