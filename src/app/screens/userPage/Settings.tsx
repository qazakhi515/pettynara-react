import { Box } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PetsIcon from "@mui/icons-material/Pets";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import Button from "@mui/material/Button";
import { useGlobals } from "../../components/hooks/useGlobals";
import { useState } from "react";
import { MemberUpdateInput } from "../../../lib/types/member";
import { T } from "../../../lib/types/common";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import { Messages, serverApi } from "../../../lib/config";
import MemberService from "../../services/memberService";

export function Settings() {
  const { authMember, setAuthMember } = useGlobals();
  const [memberImage, setMemberImage] = useState<string>(
    authMember?.memberImage
      ? `${serverApi}/${authMember.memberImage}`
      : "/icons/default-user.svg",
  );

  const [memberUpdateInput, setMemberUpdateInput] = useState<MemberUpdateInput>(
    {
      memberNick: authMember?.memberNick,
      memberPhone: authMember?.memberPhone,
      memberAddress: authMember?.memberAddress,
      memberDesc: authMember?.memberDesc,
      memberImage: authMember?.memberImage,
    },
  );

  /*** HANDLERS ***/

  const memberNickHandler = (e: T) => {
    memberUpdateInput.memberNick = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const memberPhoneHandler = (e: T) => {
    memberUpdateInput.memberPhone = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const memberAddressHandler = (e: T) => {
    memberUpdateInput.memberAddress = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const memberDescriptionHandler = (e: T) => {
    memberUpdateInput.memberDesc = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const handleSubmitButton = async () => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      if (
        memberUpdateInput.memberNick === "" ||
        memberUpdateInput.memberPhone === "" ||
        memberUpdateInput.memberAddress === "" ||
        memberUpdateInput.memberDesc === ""
      ) {
        throw new Error(Messages.error3);
      }

      const member = new MemberService();

      const result = await member.updateMember(memberUpdateInput);
      setAuthMember(result);

      await sweetTopSmallSuccessAlert("Modified successfully!", 700);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const handleImageViewer = (e: T) => {
    const file = e.target.files[0];
    console.log("file:", file);
    const fileType = file.type,
      validateImageTypes = ["image/jpg", "image/jpeg", "image/png"];

    if (!validateImageTypes.includes(fileType)) {
      sweetErrorHandling(Messages.error5).then();
    } else {
      if (file) {
        memberUpdateInput.memberImage = file;
        setMemberUpdateInput({ ...memberUpdateInput });
        setMemberImage(URL.createObjectURL(file));
      }
    }
  };

  return (
    <Box className={"settings"}>
      {/* AVATAR UPLOAD */}
      <Box className={"member-media-frame"}>
        <img src={memberImage} className={"mb-image"} alt="" />
        <div className={"media-change-box"}>
          <span>Profile Image</span>
          <p>Upload a clear image of yourself or your pet.</p>
          <div className={"up-del-box"}>
            <Button component="label" onChange={handleImageViewer}>
              <FileUploadOutlinedIcon fontSize="small" />
              Upload Image
              <input type="file" hidden />
            </Button>
          </div>
          <p>JPG, JPEG, PNG formats only (Max. 5MB).</p>
        </div>
      </Box>

      {/* DISPLAY NAME + PHONE */}
      <Box className={"input-frame"}>
        <div className={"short-input"}>
          <label className={"spec-label"}>
            <PersonOutlineIcon /> Display Name
          </label>
          <input
            className={"spec-input mb-nick"}
            type="text"
            placeholder={authMember?.memberNick}
            value={memberUpdateInput.memberNick}
            name="memberNick"
            onChange={memberNickHandler}
          />
        </div>
        <div className={"short-input"}>
          <label className={"spec-label"}>
            <PhoneOutlinedIcon /> Phone Number
          </label>
          <input
            className={"spec-input mb-phone"}
            type="text"
            placeholder={authMember?.memberPhone ?? "no phone"}
            value={memberUpdateInput.memberPhone}
            name="memberPhone"
            onChange={memberPhoneHandler}
          />
        </div>
      </Box>

      {/* ADDRESS + EMAIL */}
      <Box className={"input-frame"}>
        <div className={"short-input"}>
          <label className={"spec-label"}>
            <LocationOnOutlinedIcon /> Address
          </label>
          <input
            className={"spec-input  mb-address"}
            type="text"
            placeholder={
              authMember?.memberAddress
                ? authMember.memberAddress
                : "no address"
            }
            value={memberUpdateInput.memberAddress}
            name="memberAddress"
            onChange={memberAddressHandler}
          />
        </div>
        <div className={"short-input"}>
          <label className={"spec-label"}>
            <EmailOutlinedIcon /> Email Address
          </label>
          <input
            className={"spec-input"}
            type="text"
            placeholder="user@example.com"
            readOnly
          />
        </div>
      </Box>

      {/* FAVORITE PET + HOME TYPE */}
      <Box className={"input-frame"}>
        <div className={"short-input"}>
          <label className={"spec-label"}>
            <PetsIcon /> Favorite Pet
          </label>
          <select
            className={"spec-input"}
            defaultValue="Dog lover"
            aria-label="Favorite Pet"
          >
            <option>Dog lover</option>
            <option>Cat friendly</option>
            <option>Loves all pets</option>
          </select>
        </div>
        <div className={"short-input"}>
          <label className={"spec-label"}>
            <HomeOutlinedIcon /> Home Type
          </label>
          <select
            className={"spec-input"}
            defaultValue="Apartment"
            aria-label="Home Type"
          >
            <option>Apartment</option>
            <option>House</option>
            <option>Farm / Garden</option>
          </select>
        </div>
      </Box>

      {/* ABOUT ME */}
      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"}>
            <ChatBubbleOutlineIcon /> About Me
          </label>
          <textarea
            className={"spec-textarea mb-description"}
            placeholder={
              authMember?.memberDesc ? authMember.memberDesc : "no description"
            }
            value={memberUpdateInput.memberDesc}
            name="memberDesc"
            maxLength={300}
            onChange={memberDescriptionHandler}
          />
          <span className={"char-count"}>
            {(memberUpdateInput.memberDesc ?? "").length} / 300
          </span>
        </div>
      </Box>

      {/* PREFERENCES */}
      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"}>
            <PetsIcon /> Preferences
          </label>
          <div className={"pref-chips"}>
            <span className={"pref-chip"}>
              <PetsIcon fontSize="small" /> Dog lover
            </span>
            <span className={"pref-chip"}>
              <PetsIcon fontSize="small" /> Cat friendly
            </span>
            <span className={"pref-chip"}>
              <LocalShippingOutlinedIcon fontSize="small" /> Available for delivery
              updates
            </span>
          </div>
        </div>
      </Box>

      {/* ACTIONS */}
      <Box className={"save-box"}>
        <Button
          variant={"contained"}
          className={"save-btn"}
          onClick={handleSubmitButton}
        >
          Save Changes
        </Button>
        <Button variant={"outlined"} className={"cancel-btn"} type="button">
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
