using UnityEngine;
using UnityEngine.InputSystem; // Added for the new Input System!
using UniVRM10; // Updated to UniVRM 1.0!

[RequireComponent(typeof(Vrm10Instance))]
public class MiyonaEmotionController : MonoBehaviour
{
    private Vrm10Instance vrmInstance; // UniVRM 1.0 component

    // We store the current emotion so we can reset it when a new one comes in
    private ExpressionPreset currentEmotion = ExpressionPreset.neutral;
    private bool isSpeaking = false; // Tracks if she is currently "talking"

    void Start()
    {
        // VRM 1.0 uses Vrm10Instance for all expressions
        vrmInstance = GetComponent<Vrm10Instance>();
        
        if (vrmInstance == null)
        {
            Debug.LogError("MiyonaEmotionController: Vrm10Instance not found! Ensure script is on the VRM root.");
        }
        else
        {
            Debug.Log("MiyonaEmotionController: Successfully found Vrm10Instance. Ready for emotions.");
        }

        if (Keyboard.current == null)
        {
            Debug.LogWarning("MiyonaEmotionController: Keyboard.current is NULL. The new Input System might not be capturing the keyboard.");
        }
    }

    void Update()
    {
        // 1. Try New Input System first
        if (Keyboard.current != null)
        {
            if (Keyboard.current.digit1Key.wasPressedThisFrame) TestJoy();
            if (Keyboard.current.digit2Key.wasPressedThisFrame) TestSorrow();
            if (Keyboard.current.digit3Key.wasPressedThisFrame) TestFun();
            if (Keyboard.current.digit4Key.wasPressedThisFrame) TestNeutral();
            if (Keyboard.current.digit5Key.wasPressedThisFrame) ToggleSpeaking(); // Press 5
        }
        // 2. Fallback to Legacy Input System just in case the project is in "Both" mode
        else if (Input.anyKeyDown) 
        {
            if (Input.GetKeyDown(KeyCode.Alpha1)) TestJoy();
            if (Input.GetKeyDown(KeyCode.Alpha2)) TestSorrow();
            if (Input.GetKeyDown(KeyCode.Alpha3)) TestFun();
            if (Input.GetKeyDown(KeyCode.Alpha4)) TestNeutral();
            if (Input.GetKeyDown(KeyCode.Alpha5)) ToggleSpeaking();
        }
    }

    /// <summary>
    /// This method can be called from WebGLBridge to change Miyona's facial expression.
    /// Accepted strings: "happy", "angry", "sad", "relaxed", "surprised", "neutral"
    /// </summary>
    public void SetEmotion(string emotionName)
    {
        if (vrmInstance == null || vrmInstance.Runtime == null)
        {
            Debug.LogError("MiyonaEmotionController: VRM Runtime is missing! Cannot set emotion.");
            return;
        }

        Debug.Log($"MiyonaEmotionController: Attempting to set emotion to '{emotionName}'");

        // Reset the previous emotion to 0 (off)
        vrmInstance.Runtime.Expression.SetWeight(ExpressionKey.CreateFromPreset(currentEmotion), 0f);

        // Parse the requested emotion string into an ExpressionPreset enum
        ExpressionPreset newEmotion;
        if (System.Enum.TryParse(emotionName, true, out newEmotion))
        {
            // Successfully parsed. Set the new emotion to 1 (fully on)
            vrmInstance.Runtime.Expression.SetWeight(ExpressionKey.CreateFromPreset(newEmotion), 1f);
            currentEmotion = newEmotion;
            Debug.Log($"-> SUCCESS: Emotion changed to {newEmotion}");
        }
        else
        {
            // Fallback to neutral if we didn't understand the string
            Debug.LogWarning($"-> FAILED: Unknown emotion '{emotionName}'. Defaulting to neutral.");
            vrmInstance.Runtime.Expression.SetWeight(ExpressionKey.CreateFromPreset(ExpressionPreset.neutral), 1f);
            currentEmotion = ExpressionPreset.neutral;
        }
    }

    // Helper method for testing in the Editor
    public void TestJoy() { Debug.Log("Key 1 Pressed"); SetEmotion("happy"); }
    public void TestSorrow() { Debug.Log("Key 2 Pressed"); SetEmotion("sad"); }
    public void TestFun() { Debug.Log("Key 3 Pressed"); SetEmotion("relaxed"); }
    public void TestNeutral() { Debug.Log("Key 4 Pressed"); SetEmotion("neutral"); }

    public void ToggleSpeaking() 
    { 
        if (isSpeaking)
        {
            StopSpeaking();
        }
        else
        {
            StartSpeaking();
        }
    }

    public void StartSpeaking()
    {
        if (!isSpeaking)
        {
            isSpeaking = true;
            Debug.Log("Speaking Started");
            StartCoroutine(SimulateSpeaking());
        }
    }

    public void StopSpeaking()
    {
        if (isSpeaking)
        {
            isSpeaking = false;
            Debug.Log("Speaking Stopped");
            // The coroutine will end on its own because `isSpeaking` is now false
        }
    }

    // A fun little coroutine to randomly flap her mouth using VRM vowel blendshapes!
    private System.Collections.IEnumerator SimulateSpeaking()
    {
        ExpressionKey[] vowels = new ExpressionKey[] {
            ExpressionKey.CreateFromPreset(ExpressionPreset.aa),
            ExpressionKey.CreateFromPreset(ExpressionPreset.ih),
            ExpressionKey.CreateFromPreset(ExpressionPreset.ou),
            ExpressionKey.CreateFromPreset(ExpressionPreset.ee),
            ExpressionKey.CreateFromPreset(ExpressionPreset.oh)
        };

        while (isSpeaking && vrmInstance != null && vrmInstance.Runtime != null)
        {
            // Pick a random vowel shape
            ExpressionKey currentVowel = vowels[Random.Range(0, vowels.Length)];
            
            // Randomly open the mouth between 50% and 100%
            vrmInstance.Runtime.Expression.SetWeight(currentVowel, Random.Range(0.5f, 1.0f));
            
            // Hold it open for a fraction of a second
            yield return new WaitForSeconds(Random.Range(0.05f, 0.15f));
            
            // Close the mouth shape back to 0
            vrmInstance.Runtime.Expression.SetWeight(currentVowel, 0f);
            
            // Wait a tiny bit before creating the next mouth shape
            yield return new WaitForSeconds(Random.Range(0.02f, 0.08f));
        }

        // Just to be safe, if we stop speaking, ensure all vowels are perfectly closed (0)
        if (vrmInstance != null && vrmInstance.Runtime != null)
        {
            foreach(var v in vowels)
            {
                vrmInstance.Runtime.Expression.SetWeight(v, 0f);
            }
        }
    }
}
