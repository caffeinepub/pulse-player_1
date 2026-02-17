import { useTheme } from 'next-themes';

export function AppBrandHeader() {
  const { theme } = useTheme();
  
  const bgImage = theme === 'dark' 
    ? '/assets/generated/hero-bg-dark.dim_1440x900.png'
    : '/assets/generated/hero-bg-light.dim_1440x900.png';

  return (
    <div 
      className="relative h-56 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
      <div className="relative h-full flex flex-col items-center justify-center px-4">
        <img 
          src="/assets/generated/app-logo.dim_512x512.png" 
          alt="Pulse Player" 
          className="w-24 h-24 mb-4 drop-shadow-lg"
        />
        <h1 className="text-4xl font-bold tracking-tight">Pulse Player</h1>
        <p className="text-muted-foreground mt-2 text-lg">Your music, your way</p>
      </div>
    </div>
  );
}
