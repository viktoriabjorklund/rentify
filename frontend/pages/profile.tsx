export default function Profile() {
    return (
      <div className="flex h-screen text-black">
        {/* Sidebar */}
        <div className="basis-1/4 bg-red-200 flex flex-col p-4">
          <div>ProfilInfo</div>
          <div>Lägg upp annons</div>
          <div>Inkorg</div>
          <div>Dina annonser</div>
        </div>
  
        {/* Main content */}
        <div className="basis-3/4 bg-blue-300 flex flex-col items-center justify-center">
          <img src="/speaker.png" alt="Profilbild" className="w-36 h-36 mb-4" /> // Example profile pictu
          <div className="text-lg">Information</div>
        </div>
      </div>
    );
  }