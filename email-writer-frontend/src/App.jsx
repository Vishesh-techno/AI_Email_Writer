// App.jsx
import './App.css';
import React, { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!emailContent) return;
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone
      });

       const respData = typeof response.data === "string"
        ? response.data
        : JSON.stringify(response.data, null, 2);

      setGeneratedReply(respData);
      // alert(respData);
    } catch (err) {
      console.error(err);
      alert("Kuch error aaya — console check karo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Email Reply Generator
        </Typography>

        <Box sx={{ mx: 0 }}>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            label="Original Email Content"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="tone-label">Tone (Optional)</InputLabel>
            <Select
              labelId="tone-label"
              value={tone}
              label="Tone (Optional)"
              onChange={(e) => setTone(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Professional">Professional</MenuItem>
              <MenuItem value="Casual">Casual</MenuItem>
              <MenuItem value="Friendly">Friendly</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            sx={{ mb: 2 }}
            onClick={handleSubmit}
            disabled={!emailContent || loading}
            startIcon={loading ? <CircularProgress size={18} /> : null}
          >
            {loading ? "Generating..." : "Generate Reply"}
          </Button>
        </Box>

         <Box sx={{ mx: 0 }}>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={generatedReply || ''}
            inputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />

          <Button
            variant="outlined"
            onClick={() => navigator.clipboard.writeText(generatedReply)}
          >
            Copy to Clipboard
          </Button>

          </Box>

      </Container>
    </>
  );
}

export default App;
