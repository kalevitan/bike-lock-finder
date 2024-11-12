interface AddPointProps {
  name: string;
  lat: string;
  lon: string;
  description?: string;
  onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLatChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLonChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const AddPoint: React.FC<AddPointProps> = (props) => {

  return (
    <div className="add-point">
      <form className="space-y-4 text-black">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col text-left">
            <label htmlFor="name" className="mb-2">Name</label>
            <input type="text" id="name" name="name" className="p-2 border rounded" value={props.name} onChange={props.onNameChange} required />
          </div>
          <div className="flex flex-col text-left">
            <label htmlFor="lat" className="mb-2">Lat</label>
            <input type="text" id="lat" name="lat" className="p-2 border rounded" value={props.lat} onChange={props.onLatChange} required />
          </div>
          <div className="flex flex-col text-left">
            <label htmlFor="lon" className="mb-2">Lon</label>
            <input type="text" id="lon" name="lon" className="p-2 border rounded" value={props.lon} onChange={props.onLonChange}required />
          </div>
          <div className="flex flex-col text-left">
            <label htmlFor="description" className="mb-2">Description</label>
            <textarea id="description" name="description" className="p-2 border rounded" value={props.description} onChange={props.onDescriptionChange}></textarea>
          </div>
        </div>
        {/* <button type="submit" className="btn mt-4 text-white">Submit</button> */}
      </form>
    </div>
  )
}
