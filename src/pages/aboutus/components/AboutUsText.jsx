import React from 'react';

const AboutUsText = () => {
  return (
    <div className="w-full bg-white py-16">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10 px-4 md:px-8">
        {/* Left Side */}
        <div className="md:w-1/2">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">About Us</h2>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-snug">
            We Value Our Clients And<br />
            Want Them To Have A Nice<br />
            Experience
          </h1>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 text-slate-600 space-y-6 text-base leading-relaxed">
          <p>
            Lorem ipsum dolor sit amet consectetur. Convallis integer enim eget sit urna. Eu duis lectus amet
            vestibulum varius. Nibh tellus sit sit at lorem facilisis. Nunc vulputate ac interdum aliquet
            vestibulum in tellus.
          </p>
          <p>
            Sit convallis rhoncus dolor purus amet orci urna. Lobortis vulputate vestibulum consectetur donec
            ipsum egestas velit laoreet justo. Eu dignissim egestas egestas ipsum. Sit est nunc pellentesque at
            a aliquam ultrices consequat. Velit duis velit nec amet eget eu morbi. Libero non diam sit viverra
            dignissim. Aliquam tincidunt in cursus euismod enim.
          </p>
          <p>
            Magna odio sed ornare ultrices. Id lectus mi amet sit at sit arcu mi nisl. Mauris egestas arcu mauris.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsText;
