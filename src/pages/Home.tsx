export function Home() {
  const handleLogin = () => {
    sessionStorage.removeItem("preview_authed_v1");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 font-mono">
      <div className="max-w-xl space-y-8">
        <div className="space-y-6 leading-relaxed text-base">
          <p>
            Christian Gibson is a versatile developer with expertise in front-end design, SEO optimization, and full stack technologies. With experience spanning Apple, PropTech, and freelance work, he delivers creative & practical tech solutions.
          </p>

          <p className="pt-4">
            His website is Under Construction.
          </p>
        </div>

        <div className="flex gap-6 pt-4">
          <button className="text-white hover:opacity-70 transition-opacity">
            Resume
          </button>
          <button
            onClick={handleLogin}
            className="text-white hover:opacity-70 transition-opacity"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
