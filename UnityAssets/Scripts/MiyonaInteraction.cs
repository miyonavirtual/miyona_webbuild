using UnityEngine;
using UnityEngine.InputSystem;

public class MiyonaInteraction : MonoBehaviour
{
    private MiyonaEmotionController emotionController;
    private Coroutine currentResetCoroutine;

    void Start()
    {
        emotionController = GetComponent<MiyonaEmotionController>();
        if (emotionController == null)
        {
            Debug.LogError("MiyonaInteraction: MiyonaEmotionController not found on this object!");
        }
    }

    void Update()
    {
        if (Pointer.current != null && Pointer.current.press.wasPressedThisFrame)
        {
            HandleTouch(Pointer.current.position.ReadValue());
        }
    }

    void HandleTouch(Vector3 screenPosition)
    {
        Ray ray = Camera.main.ScreenPointToRay(screenPosition);
        RaycastHit hit;

        if (Physics.Raycast(ray, out hit))
        {
            string partName = hit.collider.gameObject.name;
            Debug.Log("Touched: " + partName);

            switch (partName.ToLower())
            {
                case "cheek_l":
                case "cheek_r":
                    TriggerBlush();
                    break;
                case "head":
                case "j_bip_c_head": // Added exact VRM bone name!
                    TriggerPat();
                    break;
                default:
                    // General reaction
                    break;
            }
        }
    }

    void TriggerBlush()
    {
        if (emotionController != null)
        {
            emotionController.SetEmotion("surprised"); // Matches the bashful expression
            StartEmotionReset();
        }
    }

    void TriggerPat()
    {
        if (emotionController != null)
        {
            emotionController.SetEmotion("happy"); // Only changes the face to happy
            StartEmotionReset();
        }
    }

    void StartEmotionReset()
    {
        // Cancel any existing timer if we touch her again before it finishes
        if (currentResetCoroutine != null)
        {
            StopCoroutine(currentResetCoroutine);
        }
        
        // Start a new 2-second timer to return to neutral
        currentResetCoroutine = StartCoroutine(ResetEmotionAfterDelay(2.0f));
    }

    private System.Collections.IEnumerator ResetEmotionAfterDelay(float delay)
    {
        yield return new WaitForSeconds(delay);
        
        if (emotionController != null)
        {
            emotionController.SetEmotion("neutral");
        }
    }
}
// hello. This file has been updated.
