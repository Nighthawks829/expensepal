import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import axios from "axios";

export default function InviteMembersScreen() {
  const [userId, setUserId] = useState("");

  const handleInviteMember = async () => {
    try {
      await axios.post(
        "http://192.168.0.112/expensepal_api/inviteMember.php",
        {
          userId,
        }
      );
      setUserId("");
    } catch (error) {
      console.error("Error inviting member:", error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Enter User ID to Invite"
        value={userId}
        onChangeText={setUserId}
      />
      <Button title="Invite Member" onPress={handleInviteMember} />
    </View>
  );
}
