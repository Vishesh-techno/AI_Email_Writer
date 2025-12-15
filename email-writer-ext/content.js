console.log("Email Writer")

function getEmailContent(){
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="Presentation"]'
    ];
    for(const selector of selectors){
        const content = document.querySelector(selector);
        if(content){
            return content.innerText.trim();
        }
        return '';
    }
}

function findComposeToolbar(){
    const selectors = ['.btC', '.aDh', '[role="toolbar"]', '.gU.Up']
    for(const selector of selectors){
        const toolbar = document.querySelector(selector);
        if(toolbar){
            return toolbar;
        }
        return null;
    }
}

function createAIButtton(){
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.borderRadius = '8px';
    button.style.overflow = 'hidden';
    button.style.margin = '8px';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    return button;
}


function injectButton(){
    const existingButton = document.querySelector('.ai-reply-button');
    if(existingButton){
        existingButton.remove();
    }

    const toolbar = findComposeToolbar();
    if(!toolbar){
        console.log("Toolbar not found");
        return;
    }

    console.log("Toolbar Found");
    const button = createAIButtton();
    button.classList.add('ai-reply-button');

    button.addEventListener('click', async () =>{
        try {
            button.innerHTML = 'Generating...';
            button.disabled = true;
            const emailContent = getEmailContent();

            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: "professional"
                })
            });

            if(!response.ok){
                throw new Error("API Request Failed!!")
            }

            const generatedReply = await response.text();

            const composeBox = document.querySelector(
                '[role="textbox"][g_editable="true"]'
            );

            if(composeBox){
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            } 

            button.innerHTML = 'AI Reply';
            button.disabled = false;

        } catch (error) {
            console.error(error);
            button.innerHTML = 'AI Reply';
            button.disabled = false;l̥
        }

    });
    toolbar.insertBefore(button, toolbar.firstChild);
}


const observer = new MutationObserver((mutations) => {
    for(const mutation of mutations){
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposedElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE && 
            (node.matches('.aDh, .btC, [role="dialog"]')
            || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );

        if(hasComposedElements){
            console.log("Compose Window Detected");
            setTimeout(injectButton, 500);
        }
    }

});

observer.observe(document.body, {
    childList: true, 
    subtree: true
})