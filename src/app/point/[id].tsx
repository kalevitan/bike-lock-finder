const PointDetails = () => {
  return (
    <div>
      <h1>Point Details</h1>
    </div>
  )
}

export default PointDetails;

export const loader = async ({params}) => {
  // Fetch data from an external API.
  console.log(params.id);
  return (
    [
      { id: "123", title: 'Test', latitude: "35.597042", longitude: "-82.555625", description: 'Test Description' }
    ]
  )
}