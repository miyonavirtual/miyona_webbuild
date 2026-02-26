using UnityEngine;
using UniVRM10; // Required for VRM expressions

[RequireComponent(typeof(Animator))]
[RequireComponent(typeof(MiyonaEmotionController))] // We need the script we just built!
public class MiyonaAnimationController : MonoBehaviour
{
    private Animator animator;
    private MiyonaEmotionController emotionController;

    void Start()
    {
        animator = GetComponent<Animator>();
        emotionController = GetComponent<MiyonaEmotionController>();

        if (animator == null) Debug.LogError("MiyonaAnimationController: Animator not found!");
        if (emotionController == null) Debug.LogError("MiyonaAnimationController: MiyonaEmotionController not found!");
    }

    void Update()
    {
        // For testing in the editor! Press these keys to trigger the animations
        if (UnityEngine.InputSystem.Keyboard.current != null)
        {
            if (UnityEngine.InputSystem.Keyboard.current.eKey.wasPressedThisFrame) PlayReaction("excited");
            if (UnityEngine.InputSystem.Keyboard.current.cKey.wasPressedThisFrame) PlayReaction("clapping");
            if (UnityEngine.InputSystem.Keyboard.current.kKey.wasPressedThisFrame) PlayReaction("kiss");
            if (UnityEngine.InputSystem.Keyboard.current.wKey.wasPressedThisFrame) PlayReaction("wave");
            if (UnityEngine.InputSystem.Keyboard.current.bKey.wasPressedThisFrame) PlayReaction("bashful");
            if (UnityEngine.InputSystem.Keyboard.current.tKey.wasPressedThisFrame) PlayReaction("thinking");
            if (UnityEngine.InputSystem.Keyboard.current.sKey.wasPressedThisFrame) PlayReaction("sigh");
            if (UnityEngine.InputSystem.Keyboard.current.aKey.wasPressedThisFrame) PlayReaction("angry");
        }
        else if (Input.anyKeyDown)
        {
            if (Input.GetKeyDown(KeyCode.E)) PlayReaction("excited");
            if (Input.GetKeyDown(KeyCode.C)) PlayReaction("clapping");
            if (Input.GetKeyDown(KeyCode.K)) PlayReaction("kiss");
            if (Input.GetKeyDown(KeyCode.W)) PlayReaction("wave");
            if (Input.GetKeyDown(KeyCode.B)) PlayReaction("bashful");
            if (Input.GetKeyDown(KeyCode.T)) PlayReaction("thinking");
            if (Input.GetKeyDown(KeyCode.S)) PlayReaction("sigh");
            if (Input.GetKeyDown(KeyCode.A)) PlayReaction("angry");
        }
    }

    /// <summary>
    /// This is the MASTER method called by WebGLBridge. 
    /// It receives ONE string from the AI (e.g. "Excited", "Sad", "Thinking")
    /// and triggers BOTH the full-body animation AND the correct facial expression!
    /// </summary>
    public void PlayReaction(string reactionName)
    {
        if (animator == null || emotionController == null) return;

        Debug.Log($"MiyonaAnimationController: Playing Master Reaction -> {reactionName}");

        switch (reactionName.ToLower())
        {
            // --- POSITIVE & CUTE ---
            case "excited":
                animator.SetTrigger("Excited"); // Downloaded: "Excited"
                emotionController.SetEmotion("happy");
                break;

            case "cheer":
            case "clapping":
            case "clap":
                animator.SetTrigger("Clapping"); // Downloaded: "Clapping"
                emotionController.SetEmotion("happy");
                break;

            case "kiss":
                animator.SetTrigger("FlyingKiss"); // Downloaded: "Blowing Kiss"
                emotionController.SetEmotion("relaxed"); // Relaxed eyes look seductive/sweet
                break;

            case "wave":
            case "hello":
                // We reuse the wave from her entrance animation here
                animator.SetTrigger("Wave"); 
                emotionController.SetEmotion("happy");
                break;

            case "shy":
            case "bashful":
                animator.SetTrigger("Bashful"); // Downloaded: "Bashful"
                emotionController.SetEmotion("surprised"); // Wide eyes
                break;

            // --- NEUTRAL / CONVERSATIONAL ---
            case "thinking":
            case "hmm":
                animator.SetTrigger("Thinking"); // Downloaded: "Thinking"
                emotionController.SetEmotion("neutral");
                break;

            case "neutral":
            case "idle":
                // Just let her return to normal idle state
                emotionController.SetEmotion("neutral");
                break;

            // --- SAD & NEGATIVE ---
            case "sigh":
            case "relieved":
            case "sad": // Catch sad here since we removed crying
                animator.SetTrigger("Sigh"); // Downloaded: "Relieved Sigh"
                emotionController.SetEmotion("sad");
                break;

            case "angry":
            case "mad":
                animator.SetTrigger("Angry"); // Downloaded: "Angry"
                emotionController.SetEmotion("angry");
                break;

            default:
                Debug.LogWarning($"Unknown reaction '{reactionName}'. Returning to neutral.");
                emotionController.SetEmotion("neutral");
                break;
        }
    }
}
