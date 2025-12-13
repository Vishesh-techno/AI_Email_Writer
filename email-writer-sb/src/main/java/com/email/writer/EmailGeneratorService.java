package com.email.writer;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.ClientResponse;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import reactor.core.publisher.Mono;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;
    private final String apiKey;
    private final ObjectMapper mapper = new ObjectMapper();

    
    public EmailGeneratorService(@Value("${gemini.api.url}") String baseUrl,
                                 @Value("${gemini.api.key}") String geminiApiKey) {
        this.webClient = WebClient.builder().baseUrl(baseUrl).build();
        this.apiKey = geminiApiKey;
    }

    public String generateEmailReply(EmailRequest emailRequest) {
//        Build prompt --> Step 1 
        String prompt = buildPrompt(emailRequest);

        String escapedPrompt;
        try {
            escapedPrompt = mapper.writeValueAsString(prompt); 
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to escape prompt for JSON", e);
        }

//        build JSON safely --> Step 2
        String requestBody = String.format("""
                {
                  "contents": [
                    {
                      "parts": [
                        {
                          "text": %s
                        }
                      ]
                    }
                  ]
                }
                """, escapedPrompt);

//         Send Request --> Step 3
        String response = webClient.post()
                .uri("/v1beta/models/gemini-2.5-flash:generateContent")
                .header("x-goog-api-key", apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.isError(),
                        (ClientResponse resp) -> resp.bodyToMono(String.class)
                                .flatMap(body -> Mono.error(new RuntimeException("API error: " + body))))
                .bodyToMono(String.class)
                .block(Duration.ofSeconds(30));
        
//      Extract Response --> Step 4
        if (response == null) {
            throw new RuntimeException("Empty response from Gemini API");
        }

        return extractResponseContent(response);
    }

    private String extractResponseContent(String response) {
        try {
            JsonNode root = mapper.readTree(response);

            JsonNode candidates = root.path("candidates");
            if (candidates.isMissingNode() || !candidates.isArray() || candidates.size() == 0) {
                throw new RuntimeException("No candidates found in response: " + response);
            }

            JsonNode candidate = candidates.get(0);
            JsonNode parts = candidate.path("content").path("parts");
            if (parts.isMissingNode() || !parts.isArray() || parts.size() == 0) {
                throw new RuntimeException("No content.parts found in response: " + response);
            }

            String text = parts.get(0).path("text").asText(null);
            if (text == null) {
                throw new RuntimeException("No text field in response part: " + response);
            }
            return text;

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse response JSON", e);
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a professional email reply of the following email and give response without subject: ");
        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append("Use a ").append(emailRequest.getTone()).append(" tone.");
        }
        prompt.append("Original Email: \n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}
