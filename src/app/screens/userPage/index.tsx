import { useState, useEffect } from "react";
import { Box, Container, Stack } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { Settings } from "./Settings";
import { useGlobals } from "../../components/hooks/useGlobals";
import { useHistory } from "react-router-dom";
import { MemberType } from "../../../lib/enums/member.enum";
import { getImageUrl } from "../../../lib/config";
import LikeService from "../../services/LikeService";
import { Product } from "../../../lib/types/product";
import { subscribeFavorites } from "../../components/favorite/favStore";
import FavoriteButton from "../../components/favorite/FavoriteButton";
import "../../../css/userPage.css";

export default function UserPage() {
  const history = useHistory();
  const { authMember } = useGlobals();

  // Liked / saved pets. The server returns the full products in one call, so
  // this no longer fans out into one request per liked id.
  const [savedPets, setSavedPets] = useState<Product[]>([]);

  useEffect(() => {
    const loadSaved = async () => {
      if (!authMember) {
        setSavedPets([]);
        return;
      }
      try {
        setSavedPets(await new LikeService().getMyLikes());
      } catch (err) {
        console.log("Couldn't load saved pets:", err);
        setSavedPets([]);
      }
    };

    loadSaved();
    // refresh when a pet is liked/unliked anywhere in the app
    return subscribeFavorites(loadSaved);
  }, [authMember]);

  if (!authMember) history.push("/");
  return (
    <div className={"user-page"}>
      <Container>
        {/* PAGE HEADING */}
        <Box className={"mypage-heading"}>
          <h1>My Profile</h1>
          <p>Manage your Pettynara profile and pet preferences. 🐾</p>
        </Box>

        <Stack className={"my-page-frame"}>
          {/* LEFT — PROFILE SETTINGS */}
          <Stack className={"my-page-left"}>
            <Box display={"flex"} flexDirection={"column"}>
              <Box className={"menu-name"}>Profile Settings</Box>
              <Box className={"menu-content"}>
                <Settings />
              </Box>
            </Box>
          </Stack>

          {/* RIGHT — PROFILE PREVIEW */}
          <Stack className={"my-page-right"}>
            <Box className={"menu-name"}>Profile Preview</Box>
            <Box className={"order-info-box"}>
              <Box className={"preview-header"} />

              <Box className={"preview-body"}>
                <div className={"order-user-img"}>
                  <img
                    src={
                      authMember?.memberImage
                        ? getImageUrl(authMember.memberImage)
                        : "/icons/default-user.svg"
                    }
                    alt=""
                    className={"order-user-avatar"}
                  />
                  <div className={"order-user-icon-box"}>
                    <img
                      src={
                        authMember?.memberType === MemberType.RESTAURANT
                          ? "/icons/restaurant.svg"
                          : "/icons/user-badge.svg"
                      }
                      alt=""
                    />
                  </div>
                </div>

                <span className={"order-user-name"}>
                  {authMember?.memberNick}
                </span>

                <span className={"member-role"}>
                  {authMember?.memberType} <VerifiedIcon />
                </span>

                <span className={"order-user-prof"}>
                  <LocationOnIcon />
                  {authMember?.memberAddress
                    ? authMember.memberAddress
                    : "no address"}
                </span>

                <p className={"user-desc"}>
                  {authMember?.memberDesc
                    ? authMember.memberDesc
                    : "no description"}
                </p>

                <Box className={"user-media-box"}>
                  <FacebookIcon />
                  <InstagramIcon />
                  <TelegramIcon />
                  <YouTubeIcon />
                </Box>

                {/* STATS */}
                <Box className={"preview-stats"}>
                  <Box className={"stat-item"}>
                    <span className={"stat-icon"}>
                      <ShoppingBagOutlinedIcon />
                    </span>
                    <span className={"stat-label"}>Orders</span>
                    <span className={"stat-value"}>0</span>
                  </Box>
                  <Box className={"stat-item"}>
                    <span className={"stat-icon"}>
                      <FavoriteBorderIcon />
                    </span>
                    <span className={"stat-label"}>Saved Pets</span>
                    <span className={"stat-value"}>{savedPets.length}</span>
                  </Box>
                  <Box className={"stat-item"}>
                    <span className={"stat-icon"}>
                      <StarBorderIcon />
                    </span>
                    <span className={"stat-label"}>Reviews</span>
                    <span className={"stat-value"}>0</span>
                  </Box>
                </Box>

                {/* PET PREFERENCES */}
                <Box className={"preview-prefs"}>
                  <div className={"prefs-title"}>Pet Preferences</div>
                  <div className={"prefs-grid"}>
                    <div className={"pref-item"}>
                      <span className={"pref-emoji"}>🐶</span>
                      <span>Dog lover</span>
                    </div>
                    <div className={"pref-item"}>
                      <span className={"pref-emoji"}>🐱</span>
                      <span>Cat friendly</span>
                    </div>
                    <div className={"pref-item"}>
                      <span className={"pref-emoji"}>🏠</span>
                      <span>Apartment</span>
                    </div>
                    <div className={"pref-item"}>
                      <span className={"pref-emoji"}>💚</span>
                      <span>Loves pets</span>
                    </div>
                  </div>
                </Box>
              </Box>
            </Box>
          </Stack>

          {/* SAVED / LIKED PETS */}
          <Box className={"saved-section"}>
            <div className={"saved-head"}>
              <h2>
                Saved Pets{" "}
                <span role="img" aria-label="heart">
                  ❤️
                </span>
              </h2>
              <span className={"saved-count"}>{savedPets.length} saved</span>
            </div>

            {savedPets.length === 0 ? (
              <div className={"saved-empty"}>
                <span>You haven't liked any pets yet.</span>
                <button
                  type="button"
                  onClick={() => history.push("/products")}
                >
                  Explore pets
                </button>
              </div>
            ) : (
              <div className={"saved-grid"}>
                {savedPets.map((p) => {
                  const img = p.productImages?.[0]
                    ? getImageUrl(p.productImages[0])
                    : "/img/home/item1.jpg";
                  return (
                    <div
                      key={p._id}
                      className={"saved-card"}
                      onClick={() => history.push(`/products/${p._id}`)}
                    >
                      <div
                        className={"saved-photo"}
                        style={{ backgroundImage: `url(${img})` }}
                      >
                        <FavoriteButton id={p._id} className={"saved-fav"} />
                      </div>
                      <div className={"saved-info"}>
                        <div className={"saved-name"}>{p.productName}</div>
                        <div className={"saved-price"}>₩{p.productPrice}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Box>

          {/* TRUST STRIP */}
          <Box className={"trust-strip"}>
            <Box className={"trust-item"}>
              <div className={"trust-ring"}>
                <span>85%</span>
              </div>
              <div className={"trust-text"}>
                <b>Profile Completion</b>
                <span>Complete your profile to get trusted by more pet parents.</span>
              </div>
            </Box>
            <Box className={"trust-item"}>
              <div className={"trust-icon"}>
                <ShieldOutlinedIcon />
              </div>
              <div className={"trust-text"}>
                <b>Safe &amp; Secure Account</b>
                <span>Your information is encrypted and always protected.</span>
              </div>
            </Box>
            <Box className={"trust-item"}>
              <div className={"trust-icon"}>
                <VerifiedIcon />
              </div>
              <div className={"trust-text"}>
                <b>Verified Contact</b>
                <span>We use your contact details only to communicate important updates.</span>
              </div>
            </Box>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
