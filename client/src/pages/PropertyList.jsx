import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import ListingCard from "../components/ListingCard";
import { setPropertyList } from "../redux/state";
import { useDispatch, useSelector } from "react-redux";

const PropertyList = () => {

  const [loading, setLoading] = useState(true)
  const user = useSelector((state) => state.user)
  const propertyList = user?.propertyList;
  const dispatch = useDispatch()


  const getPropertyList = async () => {
    try {
      const response = await fetch(`http://localhost:8000/users/${user._id}/properties`, {
        method: "GET"
      });

      const data = await response.json()

      dispatch(setPropertyList(data))

      setLoading(false)

    } catch (err) {
      console.log("Fetch all properties failed", err.message)
    }
  }

  useEffect(() => {
    getPropertyList()
  }, [])

  return loading ? <Loader /> : (
    <>
      <h1 className="title-list">Your Property List</h1>
      <div className="list">
        {propertyList?.map(
          ({
            _id,
            creator,
            listingPhotoPaths,
            city,
            province,
            country,
            category,
            type,
            price,
            booking = false,
          }) => (
            <ListingCard
              listingId={_id}
              creator={creator}
              listingPhotoPaths={listingPhotoPaths}
              city={city}
              province={province}
              country={country}
              category={category}
              type={type}
              price={price}
              booking={booking}
            />
          )
        )}
      </div>

    </>
  );
};

export default PropertyList;