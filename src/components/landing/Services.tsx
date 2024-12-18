import { Button } from "@/components/ui/button";

export const Services = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Explore Our Tailored Services for</h2>
        <h3 className="text-2xl text-center mb-12">an Enhanced Community Living Experience</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <h4 className="text-xl font-bold mb-4">Discover Personalized Features Designed Just for You</h4>
            <p className="text-gray-600 mb-4">Get insights into your community and discover features that match your needs</p>
            <Button variant="outline">Learn More</Button>
          </div>
          <div className="text-center">
            <h4 className="text-xl font-bold mb-4">Join the Marketplace to Buy and Sell Within Your Community</h4>
            <p className="text-gray-600 mb-4">Connect with neighbors and trade locally</p>
            <Button variant="outline">Sign Up</Button>
          </div>
          <div className="text-center">
            <h4 className="text-xl font-bold mb-4">Sign Up for Exciting Community Events and Activities</h4>
            <p className="text-gray-600 mb-4">Stay involved and connected with your neighbors</p>
            <Button variant="outline">Sign Up</Button>
          </div>
        </div>
      </div>
    </div>
  );
};