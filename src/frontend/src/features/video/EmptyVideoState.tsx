export function EmptyVideoState() {
  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Videos</h1>
      
      <div className="flex flex-col items-center justify-center py-12">
        <img 
          src="/assets/generated/empty-video.dim_1200x800.png" 
          alt="No videos" 
          className="w-64 h-auto mb-6 opacity-80"
        />
        <h2 className="text-xl font-semibold mb-2">No Videos Yet</h2>
        <p className="text-muted-foreground text-center max-w-sm">
          Add video files from your library to start watching
        </p>
      </div>
    </div>
  );
}
