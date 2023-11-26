import { PayPalButtons } from "@paypal/react-paypal-js";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const Order = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [username, setUsername] = useState(
    currentUser?.username ? currentUser?.username : ""
  );
  const [email, setEmail] = useState(
    currentUser?.email ? currentUser?.email : ""
  );
  const [phoneNumber, setPhoneNumber] = useState(
    currentUser?.phoneNumber ? currentUser?.phoneNumber : ""
  );

  const [paymentMethod, setPaymentMethod] = useState(1);
  const [success, setSuccess] = useState(false);
  const [orderPaypalID, setOrderPaypalID] = useState("");
  const [listing, setListing] = useState(null);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${params.id}`);
        const data = await res.json();
        if (data.success === false) {
          return;
        }
        if (!(data.status === "sale" || data.status === "rent"))
          return navigate(`/listing/${data._id}`);
        setListing(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchListing();
  }, [params.id]);

  const createOrderPaypal = async (data, actions) => {
    const orderID = await actions.order.create({
      purchase_units: [
        {
          items: [
            {
              name: `${listing.type.toUpperCase()} house name ${listing.name}`,
              description: `${listing.type.toUpperCase()} house from ${
                listing.userRef.username
              }`,
              quantity: 1,
              unit_amount: {
                currency_code: "USD",
                value: listing.regularPrice,
              },
            },
          ],
          amount: {
            currency_code: "USD",
            value: listing.regularPrice,
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: listing.regularPrice,
              },
            },
          },
          description: `${listing.type.toUpperCase()} house from ${
            listing.userRef.username
          }`,
        },
      ],
    });
    setOrderPaypalID(orderID);
    return orderID;
  };

  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      setSuccess(true);
      return details;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = !currentUser?.username
        ? {
            username,
            email,
            phoneNumber,
            listing: params.id,
            payment: {
              paypalID: orderPaypalID,
              status: success ? "pair" : "unpair",
            },
            orderStatus: listing?.type,
            listingStatus: listing?.type == "rent" ? "rented" : "solve",
          }
        : {
            user: currentUser._id,
            listing: params.id,
            payment: {
              paypalID: orderPaypalID,
              status: success ? "pair" : "unpair",
            },
            orderStatus: listing?.type,
            listingStatus: listing?.type == "rent" ? "rented" : "solve",
          };

      const res = await fetch("/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        console.log(`You ${listing.type} this house successfully!`);
        navigate(`/listing/${listing._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col max-w-6xl mx-auto p-3">
      <h2 className="text-2xl font-semibold mt-8">Reservation required</h2>
      <div className="flex flex-row-reverse gap-4">
        <img src={listing?.imageUrls[0]} className="flex-1 w-60 pt-10" />
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="mt-4 flex flex-col">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="max-w-[400px] w-full p-2 rounded"
              required
            />
          </div>
          <div className="mt-4 flex flex-col">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="max-w-[400px] w-full p-2 rounded"
              required
            />
          </div>
          <div className="mt-4 flex flex-col">
            <label htmlFor="phoneNumber">Phone number:</label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="max-w-[400px] w-full p-2 rounded"
              required
            />
          </div>
          <div className="mt-4 flex flex-col">
            <label htmlFor="select">Payment method:</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="max-w-[400px] w-full p-2 rounded"
            >
              <option value="1">Payment upon meeting</option>
              <option value="2">Paypal</option>
            </select>
            {paymentMethod == 2 && (
              <div className="max-w-[400px] w-full mt-6">
                <PayPalButtons
                  createOrder={createOrderPaypal}
                  onApprove={onApprove}
                />
              </div>
            )}
          </div>
          <div
            className={`max-w-[400px] w-full ${
              paymentMethod == 2 ? "mt-2" : "mt-6"
            }`}
          >
            <button className="bg-black text-white p-2 rounded-xl hover:bg-blue-500">
              {listing?.type === "rent" ? "Rent" : "Buy"} this house
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Order;
