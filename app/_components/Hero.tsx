import React from "react";

const Hero = () => {
  return (
    <section className="p-5 md:p-0">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex  lg:items-center">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            <span className="text-primary">Upload, Save </span>
            and easily <span className="text-primary">Share</span> your files in
            one place
          </h1>

          <p className="mt-4 sm:text-xl/relaxed text-gray-500">
            Upload your files on our cloud and easily share them with your
            friends with password protection
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-primary/90 focus:outline-none focus:ring active:bg-bg-primary/90 sm:w-auto"
              href="/files"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
