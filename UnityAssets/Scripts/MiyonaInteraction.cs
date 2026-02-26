using UnityEngine;
using UnityEngine.InputSystem;

public class MiyonaInteraction : MonoBehaviour
{
    private MiyonaEmotionController emotionController;

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
        // Detect Click or Touch using New Input System if available
        if (Pointer.current != null && Pointer.current.press.wasPressedThisFrame)
        {
            HandleTouch(Pointer.current.position.ReadValue());
        }
        // Fallback to Legacy Input System just in case
        else if (Input.GetMouseButtonDown(0))
        {
            HandleTouch(Input.mousePosition);
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
        }
    }

    void TriggerPat()
    {
        if (emotionController != null)
        {
            emotionController.SetEmotion("happy"); // Only changes the face to happy
        }
    }
}
// hello. This file has been updated.
