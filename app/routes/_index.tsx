export default function Index() {
  return (
    <div className="p-3">
      <div className="flex flex-col justify-center items-center gap-8  text-center">
        <div className="h-[30vh] flex items-center">
          <img src="logo.svg" alt="logo" className="h-14 w-14" />
        </div>

        <div className="h-[70vh] flex flex-col items-center gap-10">
          <h1 className="font-bold text-2xl max-w-3xl w-full md:text-5xl">
            Unlock the power of updates with Changelogr.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
              Join us
            </span>
          </h1>
          <p className="max-w-3xl w-full text-md font-medium text-slate-400">
            Changelogr is your one-stop destination for tracking software
            updates and changes effortlessly. Join Changelogr today and embrace
            the future of updates.
          </p>
          <a
            href="/login"
            className="px-6 py-4 rounded-full text-white text-sm font-semibold bg-blue-500 hover:bg-blue-600 w-max"
          >
            Get started now
          </a>
        </div>
      </div>
      <div>
        <h1 className="text-4xl font-bold max-w-3xl w-full text-center mx-auto mb-20">
          Explore the Power-Packed Features of Changelogr
        </h1>
        <div className="max-w-5xl w-full mx-auto">
          <div className="flex flex-col justify-center items-center md:flex-row gap-14 mb-20">
            <img
              src="editor.png"
              alt="image1"
              className="max-h-[400px] max-w-[400px] h-full w-full rounded"
            />
            <div className="flex flex-col gap-5">
              <p className="font-semibold italic text-md text-purple-500">
                Feature-Rich Editor{" "}
              </p>
              <h4 className="font-bold text-xl max-w-md">
                Elevate Your Changelog with the Ultimate Editor
              </h4>
              <p className="font-semibold">
                Our feature-rich editor empowers you to create dynamic and
                engaging changelogs effortlessly. Customize, style, and craft
                your updates with ease.
              </p>
              <ul className="list-disc font-semibold">
                <li className="text-sm mb-4 font-medium">
                  Intuitive Editing: Easily add and format content with a
                  user-friendly interface.
                </li>
                <li className="text-sm mb-4 font-medium">
                  Collaborative Editing: Work seamlessly with your team to
                  perfect your changelog.
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center md:flex-row gap-14 mb-20">
            <img
              src="tags.png"
              alt="tags"
              className="max-h-[400px] max-w-[400px] h-full w-full rounded order-0 md:order-2"
            />
            <div className="flex flex-col gap-5">
              <p className="font-semibold italic text-md text-blue-500">Tags</p>
              <h4 className="font-bold text-xl max-w-md">
                Organize and Conquer: Changelogs by Categories{" "}
              </h4>
              <p className="font-semibold">
                Keep your updates organized and accessible with categorized
                changelogs. Streamline communication and deliver the right
                information to your audience.
              </p>
              <ul className="list-disc font-semibold">
                <li className="text-sm mb-4 font-medium">
                  Structured Updates: Group your changes into logical categories
                  for clarity.
                </li>
                <li className="text-sm mb-4 font-medium">
                  Filtered Viewing: Allow users to focus on specific areas of
                  interest.
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center md:flex-row gap-14">
            <img
              src="drafts.png"
              alt="drafts"
              className="max-h-[400px] max-w-[400px] h-full w-full rounded"
            />
            <div className="flex flex-col gap-5">
              <p className="font-semibold italic text-md text-orange-500">
                Publish Only When You Want To{" "}
              </p>
              <h4 className="font-bold text-xl max-w-md">
                Control Your Updates, Your Way{" "}
              </h4>
              <p className="font-semibold">
                With our platform, you're in charge of when your updates go
                live. Schedule your releases, ensure accuracy, and maintain a
                consistent communication rhythm
              </p>
              <ul className="list-disc">
                <li className="text-sm mb-4 font-medium">
                  Scheduled Publishing: Plan your updates in advance and set
                  precise release times.
                </li>
                <li className="text-sm mb-4 font-medium">
                  Draft Mode: Review and fine-tune your changelog before making
                  it public.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <footer className="p-4 flex justify-center mt-10">
        <p className="text-sm font-semibold">
          Build by{" "}
          <a
            href="https://twitter.com/PBelaramani"
            className="text-blue-700 hover:underline"
          >
            Pooja Belaramani
          </a>
        </p>
      </footer>
    </div>
  );
}
