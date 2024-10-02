// src/pages/index.tsx

'use client';

import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProjectCard } from "@/components/ProjectCard";
import { NavBar } from "@/components/ui/NavBar";

export default function Portfolio() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const email = "albertobort@gmail.com";
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className="container mx-auto p-4 flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {darkMode ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>
      </header>

      <main className="container mx-auto p-4 space-y-12">
        {/* Introducción */}
        <section className="space-y-4">
          <div className="max-w-2xl mx-auto space-y-4">
            <h1 className="text-5xl font-bold">
              Hi, I am Alberto Bort <span role="img" aria-label="waving hand">👋</span>
            </h1>
            <p className="text-xl">
              Web developer and consultant with a passion for turning complex problems into simple, beautiful, and intuitive solutions.
            </p>
          </div>
        </section>

        {/* Sección About */}
        <section className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-2">About</h3>
          <p className="text-sm text-gray-800 dark:text-white">
            Passionate developer with extensive experience, I have developed the skills to provide much more than just web development.
            I deliver comprehensive end-to-end solutions tailored to businesses, ensuring that each project is not only functional but also optimized for user experience and performance.
            My expertise lies in leveraging the latest web technologies to help clients transform their digital ideas into reality.
          </p>
        </section>

        {/* Sección Skills */}
        <section className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            <Badge>React</Badge>
            <Badge>Node.js</Badge>
            <Badge>Express</Badge>
            <Badge>MongoDB</Badge>
            <Badge>TypeScript</Badge>
            <Badge>Jest</Badge>
            <Badge>Cypress</Badge>
            <Badge>Docker</Badge>
            <Badge>Python</Badge>
            <Badge>Machine Learning</Badge>
            <Badge>TensorFlow</Badge>
            <Badge>OpenAI API</Badge>
          </div>
        </section>

        {/* Sección My Projects */}
        <section>
          <div className="flex justify-center">
            <div className="inline-block bg-black text-white px-4 py-2 rounded-full mb-4 dark:bg-white dark:text-black">
              My Projects
            </div>
          </div>
          <h3 className="text-4xl font-bold text-center mb-2">
            Check out my latest work
          </h3>
          <p className="text-center mb-6">
            I have worked on a diverse range of projects, from simple websites to complex web applications. Below are a few of my most recent projects.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project 1 */}
            <ProjectCard
              imageSrc="project1.jpg" 
              title="Professional Profile"
              dates="Web development"
              description="An interactive portfolio showcasing professional skills and past work. Optimized for performance and accessibility, perfect for highlighting digital expertise."
              techStack={['HTML', 'CSS', 'JavaScript']}
              tools={['GitHub Pages']}
              actionText="Website"
              actionLink="https://albope.github.io/perfil-profesional/"
            />
            {/* Project 2 */}
            <ProjectCard
              imageSrc="project2.jpg"
              title="Travel Map Generator"
              dates="Web development"
              description="A tool for creating interactive travel maps, ideal for travelers or businesses in the tourism sector. Built with React and Mapbox for real-time visualization."
              techStack={['React', 'Node.js']}
              tools={['Mapbox']}
              actionText="Website"
              actionLink="https://travelmapgenerator.com/"
            />
            {/* Project 3 */}
            <ProjectCard
              imageSrc="project3.jpg"
              title="Padel App"
              dates="App development"
              description="A platform for organizing and managing padel games, offering match scheduling, results tracking, and tournament management. Built with React and Firebase."
              techStack={['React', 'Firebase']}
              tools={['Material UI']}
              actionText="Website"
              actionLink="https://padel-app-96e21.web.app/"
            />
            {/* Project 4 */}
            <ProjectCard
              imageSrc="project4.jpg"
              title="Test Web Automation"
              dates="Test Automation"
              description="Automated testing suite ensuring functionality and performance for the Travel Map Generator. Developed using Jest and React Testing Library."
              techStack={['Jest', 'React Testing Library']}
              tools={['CI/CD']}
              actionText="GitHub"
              actionLink="https://github.com/albope/travel-map-tests"
            />
          </div>
        </section>

        {/* Sección Services and Pricing */}
        <section>
          <h3 className="text-2xl font-bold mb-4">Services & Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Web Development</CardTitle>
                <CardDescription>Custom web applications</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside">
                  <li>Frontend development</li>
                  <li>Backend API development</li>
                  <li>Database design</li>
                </ul>
              </CardContent>
              <CardFooter>
                <p className="text-lg font-bold">Starting at $20/hour</p>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Web Testing</CardTitle>
                <CardDescription>Comprehensive test suites</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside">
                  <li>Unit testing</li>
                  <li>Integration testing</li>
                  <li>End-to-end testing</li>
                </ul>
              </CardContent>
              <CardFooter>
                <p className="text-lg font-bold">Starting at $30/hour</p>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Consultation</CardTitle>
                <CardDescription>Expert advice and planning</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside">
                  <li>Architecture review</li>
                  <li>Performance optimization</li>
                  <li>Best practices implementation</li>
                </ul>
              </CardContent>
              <CardFooter>
                <p className="text-lg font-bold">$50/hour</p>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Información de Contacto */}
        <section className="text-center">
          <div className="flex justify-center">
            <div className="inline-block bg-black text-white px-4 py-2 rounded-full mb-4 dark:bg-white dark:text-black">
              Contact
            </div>
          </div>
          <h3 className="text-4xl font-bold mb-4">Get in Touch</h3>
          <p className="text-lg mb-4">
            Ready to start your project?{' '}
            <a 
              href="#"
              onClick={handleEmailClick} 
              className="text-blue-500 underline"
            >
              Contact me
            </a> for a free consultation.
          </p>
          <NavBar />
        </section>
      </main>
    </div>
  );
}