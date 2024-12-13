import React, { useState, useEffect } from "react";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState({ name: "", email: "", preferences: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const BASE_URL = "https://backend-2-i0ej.onrender.com"; // Backend API URL
  const user_id = localStorage.getItem("user_id"); // Retrieve user ID from localStorage

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user_id) {
        console.error("User ID is missing from local storage");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/profile/${user_id}`);
        if (!response.ok) {
          console.error("Error fetching profile:", response.statusText);
          setLoading(false);
          return;
        }
        const data = await response.json();
        setProfile({
          ...data,
          preferences: data.preferences || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`${BASE_URL}/profile/${user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Profile updated successfully!");
        setProfile(data);
      } else {
        console.error("Error updating profile:", data.message || data.error);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile">
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="preferences">Preferences (Dietary Restrictions/Allergies):</label>
          <textarea
            id="preferences"
            name="preferences"
            value={profile.preferences}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
 