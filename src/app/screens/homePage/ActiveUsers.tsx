import { Box, Container, Stack } from "@mui/material";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import { CssVarsProvider } from "@mui/joy/styles";
import Typography from "@mui/joy/Typography";

const activeUsers = [
  { productName: "Martin", imagePath: "/img/martin.webp" },
  { productName: "Jarvis", imagePath: "/img/justin.webp" },
  { productName: "Ali", imagePath: "/img/nusret.webp" },
  { productName: "Owen", imagePath: "/img/rose.webp" },
];
export default function ActiveUsers() {
  return (
    <div className={"active-users-frame"}>
      <Container>
        <Stack className={"main"}>
          <Box className={"category-title"}>Active Users</Box>
          <Stack className={"cards-frame"}>
            <CssVarsProvider>
              {activeUsers.length !== 0 ? (
                activeUsers.map((user, index) => {
                  return (
                    <Card key={index} variant="outlined" className={"card"}>
                      <AspectRatio ratio="1">
                        <img src={user.imagePath} alt="" />
                      </AspectRatio>

                      <CardOverflow
                        variant="soft"
                        className="active-users-detail"
                      >
                        <Stack className="info">
                          <Typography className={"member-nickname"}>
                            {user.productName}
                          </Typography>
                        </Stack>
                      </CardOverflow>
                    </Card>
                  );
                })
              ) : (
                <Box className="no-data">No Active Users</Box>
              )}
            </CssVarsProvider>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
