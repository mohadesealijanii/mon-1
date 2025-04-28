import * as React from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";

export default function StarRating({ score }) {
  return (
    <Box sx={{ "& > legend": { mt: 2 } }}>
      <Rating
        sx={{ color: "#d90429" }}
        name="read-only"
        value={score}
        readOnly
      />
    </Box>
  );
}
