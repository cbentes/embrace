/*****************************************************
 *                  Junction 2018
 * 
 * Project: Embrace
*****************************************************/

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BallFearController : MonoBehaviour {

    private Renderer _renderer;
    private string ball_state = "still";
    // private string _url = "http://127.0.0.1:5000/ball_fear";
    private string _url = "http://18.203.88.206/ball_fear";


    void Start () {
        _renderer = gameObject.GetComponent<Renderer>();
        InvokeRepeating("UpdateBallState", 1.0f, 1.0f);
        // Input.compass.enabled = true;
    }


    void UpdateBallState(){
        using (WWW www = new WWW(_url))
        {
            while (!www.isDone)
            {
                // Wait response
                continue;
            }
            if (string.IsNullOrEmpty(www.error)){
                // Here, no error
                ball_state = www.text;
            }else{
                // Something whent wront ...
                ball_state = "still";
                Debug.LogError(www.error);
            }
        }
        Debug.Log("... Updating ball state ... "+ball_state);
    }

	void Update () {

        // Called when update frames
        Vector3 spherePosition = _renderer.transform.position;

        // Change position
        switch (ball_state)
        {
            case "closer":
                spherePosition.z -= 0.1f;
                break;
            case "further":
                spherePosition.z += 0.1f;
                break;
            case "still":
                break;
            default:
                break;
        }

        // Limit max distance
        if (spherePosition.z > 20.0)
            spherePosition.z = 20.0f;

        // Limit min distance
        if (spherePosition.z < 1.0)
            spherePosition.z = 1.0f;

        _renderer.transform.position = spherePosition;
        // Debug.Log(">>> " + spherePosition);
        // Debug.Log("Orientation " + Input.compass.trueHeading);

	}
}
