import { useEffect, useState } from "react";
import "../styles/List.scss"
import { useParams } from "react-router-dom";
import { useSelector,useDispatch  } from "react-redux";
import { setListings } from "../redux/state";
import Loader from "../components/Loader"
import ListingCard from "../components/ListingCard";

const SearchPage = () => {

  const [loading, setLoading] = useState(true)
  const { search } = useParams()
  const listings = useSelector((state) => state.listings)

  const dispatch = useDispatch()

  const getSearchListings = async () => {
    try {
      const response = await fetch(`http://localhost:8000/properties/search/${search}`, {
        method: "GET"
      })

      const data = await response.json()

      dispatch(setListings({ listings: data }))

      setLoading(false)
    } catch (err) {
      console.log("Fetch Search List failed!", err.message)
    }
  }

  useEffect(() => {
    getSearchListings()
  }, [search])
  
  return loading ? <Loader /> : (
    <>
      <h1 className="title-list">{search}</h1>
      <div className="list">
        {listings?.map(
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
}

export default SearchPage