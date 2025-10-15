export default function Profile() {
    return (
      <div className="flex h-screen items-center justify-center text-black">
        <div className="flex flex-col gap-24 justify-center items-center w-1/3 h-1/3">
        <div>
        <p className="text-4xl">Account Details</p>
        </div>
          <div className="flex flex-col gap-4">
            <p>username</p>
            <p>id</p>
            <p>name surname</p>
            <p>mail</p>
            <p>location</p>
          </div>
          <div className="">
            <button className="border rounded-lg w-48 h-16 bg-red-500 text-white" onClick={() => alert('Are you sure you want to delete your account? This action cannot be undone.')}> 
              Delete account
            </button>
          </div>

        </div>

      </div>
    );
  }

  //profilsida: mejl, username, location, id, name, surname saker som står i user objectet, knapp att kunna ta bort användare