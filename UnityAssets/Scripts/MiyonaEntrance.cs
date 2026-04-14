using UnityEngine;
using System.Collections;

public class MiyonaEntrance : MonoBehaviour
{
    [Header("Positions")]
    public Transform targetStandPosition; // Where she stops
    public Transform cameraTarget;        // What she looks at

    [Header("Settings")]
    public float walkSpeed = 2.0f;
    public float turnSpeed = 5.0f;

    private Animator animator;
    private int currentStep = 0; // 0=Walking, 1=Turning, 2=Waving, 3=Idle

    void Start()
    {
        animator = GetComponent<Animator>();
        
        // Start by facing the target
        if (targetStandPosition != null)
        {
            transform.LookAt(new Vector3(targetStandPosition.position.x, transform.position.y, targetStandPosition.position.z));
        }

        // Lock camera and head tracking globally without needing Inspector links
        MiyonaCameraOrbit.canMoveCamera = false;
        MiyonaEyeContact.canLookAtCamera = false;

        // Step 0: Start Walking
        if (animator != null) animator.SetBool("IsWalking", true);
    }

    void Update()
    {
        if (targetStandPosition == null || cameraTarget == null) return;

        if (currentStep == 0) // Walking
        {
            transform.position = Vector3.MoveTowards(transform.position, targetStandPosition.position, walkSpeed * Time.deltaTime);

            // Reached the spot?
            if (Vector3.Distance(transform.position, targetStandPosition.position) < 0.05f)
            {
                if (animator != null) animator.SetBool("IsWalking", false);
                currentStep = 1; // Move to turning
            }
        }
        else if (currentStep == 1) // Turning to camera
        {
            Vector3 directionToCamera = cameraTarget.position - transform.position;
            directionToCamera.y = 0;

            if (directionToCamera != Vector3.zero)
            {
                Quaternion targetRotation = Quaternion.LookRotation(directionToCamera);
                transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, turnSpeed * Time.deltaTime);

                // If almost fully turned, trigger the wave
                if (Quaternion.Angle(transform.rotation, targetRotation) < 5.0f)
                {
                    StartCoroutine(WaveSequence());
                }
            }
        }
    }

    IEnumerator WaveSequence()
    {
        currentStep = 2; // Waving

        if (animator != null)
        {
            animator.SetTrigger("Wave");
        }

        // Wait a few seconds for the wave animation to finish before going fully idle
        // The Animator will transition to Idle automatically, this just stops script execution
        yield return new WaitForSeconds(3.0f); 

        // Unlock camera and head tracking globally
        MiyonaCameraOrbit.canMoveCamera = true;
        MiyonaEyeContact.canLookAtCamera = true;

        currentStep = 3; // Idle forever
    }
}
