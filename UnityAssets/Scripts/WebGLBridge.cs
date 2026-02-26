using UnityEngine;

/// <summary>
/// This script must be attached to a GameObject named EXACTLY "WebGLBridge" in your Unity scene.
/// Next.js will use unityInstance.SendMessage("WebGLBridge", "MethodName", "Payload") to talk to us.
/// </summary>
public class WebGLBridge : MonoBehaviour
{
    [Header("Component References")]
    [Tooltip("Drag the Miyona VRM model here that has the MiyonaEmotionController script attached.")]
    public MiyonaEmotionController emotionController;

    [Tooltip("Drag the Miyona VRM model here that has the MiyonaAnimationController script attached.")]
    public MiyonaAnimationController animationController;

    private void Start()
    {
        if (emotionController == null)
        {
            // Try to find it automatically if the user forgot to assign it
            emotionController = FindObjectOfType<MiyonaEmotionController>();
            if (emotionController == null)
            {
                Debug.LogWarning("WebGLBridge: MiyonaEmotionController is not assigned!");
            }
        }

        if (animationController == null)
        {
            // Try to find it automatically if the user forgot to assign it
            animationController = FindObjectOfType<MiyonaAnimationController>();
            if (animationController == null)
            {
                Debug.LogWarning("WebGLBridge: MiyonaAnimationController is not assigned!");
            }
        }
    }

    /// <summary>
    /// Next.js calls this when the LLM outputs an emotion tag.
    /// Example: unityInstance.SendMessage("WebGLBridge", "ReceiveEmotion", "Joy");
    /// </summary>
    public void ReceiveEmotion(string emotionString)
    {
        Debug.Log("WebGLBridge received emotion command: " + emotionString);
        if (emotionController != null)
        {
            emotionController.SetEmotion(emotionString);
        }
    }

    /// <summary>
    /// Next.js calls this when the LLM outputs an emotion tag, triggering a full-body animation AND an expression.
    /// Example: unityInstance.SendMessage("WebGLBridge", "PlayReaction", "excited");
    /// </summary>
    public void PlayReaction(string reactionString)
    {
        Debug.Log("WebGLBridge received reaction command: " + reactionString);
        if (animationController != null)
        {
            animationController.PlayReaction(reactionString);
        }
        else if (emotionController != null)
        {
            // Fallback to purely facial expression if no animation controller is found
            emotionController.SetEmotion(reactionString);
        }
    }

    /// <summary>
    /// Next.js calls this when Miyona starts speaking to trigger mouth movement.
    /// Example: unityInstance.SendMessage("WebGLBridge", "StartSpeaking", "");
    /// </summary>
    public void StartSpeaking(string empty = "")
    {
        Debug.Log("WebGLBridge received speaking command: START");
        if (emotionController != null)
        {
            emotionController.StartSpeaking();
        }
    }

    /// <summary>
    /// Next.js calls this when Miyona stops speaking to halt mouth movement.
    /// Example: unityInstance.SendMessage("WebGLBridge", "StopSpeaking", "");
    /// </summary>
    public void StopSpeaking(string empty = "")
    {
        Debug.Log("WebGLBridge received speaking command: STOP");
        if (emotionController != null)
        {
            emotionController.StopSpeaking();
        }
    }

    /// <summary>
    /// Test method to ensure the bridge is working locally in the Unity Editor
    /// </summary>
    private void Update()
    {
        // Only run this test logic if we are running in the Editor
#if UNITY_EDITOR
        if (Input.GetKeyDown(KeyCode.Alpha1)) ReceiveEmotion("Joy");
        if (Input.GetKeyDown(KeyCode.Alpha2)) ReceiveEmotion("Sorrow");
        if (Input.GetKeyDown(KeyCode.Alpha3)) ReceiveEmotion("Fun");
        if (Input.GetKeyDown(KeyCode.Alpha4)) ReceiveEmotion("Surprise");
        if (Input.GetKeyDown(KeyCode.Alpha0)) ReceiveEmotion("Neutral");
#endif
    }
}
